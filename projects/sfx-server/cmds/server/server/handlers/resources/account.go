package resources

import (
	"context"
	"database/sql"
	"encoding/base64"
	"errors"
	"fmt"
	"mime"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/config"
	"sfxserver/server/handlers/otp"
	"sfxserver/server/middleware"
	"sfxserver/server/utils"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type accountHandler struct {
	middleware *middleware.ServerMiddleware
}

// 向指定邮箱发送OTP验证码
func (s *accountHandler) SendOTPCode(gctx *gin.Context) {
	in := &accountPostIn{}
	if err := gctx.ShouldBindJSON(in); err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	if len(in.Email) < 1 {
		utils.ResponseError(gctx, http.StatusInternalServerError, fmt.Errorf("邮箱不可为空"))
		return
	}
	query := &dbmodels.AccountTable{UName: in.Email}
	account := &dbmodels.AccountTable{}
	if err := s.middleware.DB.Where(query).First(account).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			utils.ResponseError(gctx, http.StatusInternalServerError, err)
			return
		}
	}
	// 用户不存在，直接注册
	if len(account.Pk) < 1 {
		otpOut, err := otp.Register(in.Email)
		if err != nil {
			utils.ResponseError(gctx, http.StatusInternalServerError, err)
			return
		}
		account = &dbmodels.AccountTable{
			Pk:         utils.NewPostId(),
			UName:      in.Email,
			UPass:      otpOut.Secret,
			CreateTime: time.Now(),
			UpdateTime: time.Now(),
			Image:      otpOut.Image,
		}
		if err := s.middleware.DB.Create(account).Error; err != nil {
			utils.ResponseError(gctx, http.StatusInternalServerError, err)
			return
		}
	}
	// 生成OTP验证码并发送邮件
	code, err := otp.GenerateCode(account.UPass, time.Now())
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	from, to, subject := "support<support@sfx.xyz>", in.Email, "验证码"
	//mailBody := fmt.Sprintf("<html><body><h1>%s</h1><h2>TOTP二维码</h2><img src='data:image/gif;base64,%s' alt='TOTP二维码' /></body></html>",
	//	code, account.Image)
	nowUnix := time.Now().Unix()
	verify := fmt.Sprintf("%d,%s", nowUnix, account.Pk)
	questVerify, err := utils.AesEncrypt(verify, []byte(config.QuestKey))
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	otpUrl := fmt.Sprintf("%s/account/image?v=%s", config.ServerUrl, questVerify)

	//logrus.Debugln("otpUrl", otpUrl)
	mailBody, err := s.middleware.Templs.Execute("mail.gohtml", gin.H{
		"code": code, "url": otpUrl,
	})
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	//logrus.Debugln("mailBody", mailBody)
	if err = s.middleware.Mail.SendMessage(from, subject, mailBody, to); err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	utils.ResponseData(gctx, http.StatusOK, gin.H{})
}

func (s *accountHandler) LoadImage(gctx *gin.Context) {
	v, ok := gctx.GetQuery("v")
	if !ok || len(v) < 1 {
		utils.ResponseError(gctx, http.StatusInternalServerError, errors.New("参数有误"))
		return
	}
	verifyDecrypted, err := utils.AesDecrypt(v, []byte(config.QuestKey))
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	array := strings.Split(verifyDecrypted, ",")
	if len(array) != 2 || len(array[0]) < 1 || len(array[1]) < 1 {
		utils.ResponseError(gctx, http.StatusInternalServerError, errors.New("LoadImage参数有误2"))
		return
	}
	timeUnix, err := strconv.ParseInt(array[0], 10, 64)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	startTime := time.Unix(timeUnix, 0)
	now := time.Now()
	if startTime.After(now) || now.Sub(startTime) > time.Minute*5 {
		gctx.File("web/images/expired.jpeg")
		return
	}
	account := &dbmodels.AccountTable{}
	if err := s.middleware.DB.First(account, "pk = ?", array[1]).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			utils.ResponseError(gctx, http.StatusInternalServerError, err)
			return
		}
	}
	if len(account.Pk) < 1 {
		utils.ResponseError(gctx, http.StatusNotFound, errors.New("未找到"))
		return
	}
	imgData, err := base64.StdEncoding.DecodeString(account.Image)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	gctx.Data(http.StatusOK, "image/png", imgData)
}

type accountPostIn struct {
	Email string `json:"email"`
}

// 通过OTP验证码登录
func (s *accountHandler) LoginByOTPCode(gctx *gin.Context) {
	in := &sessionPostIn{}
	if err := gctx.ShouldBindJSON(in); err != nil {
		utils.ResponseServerError(gctx, "参数有误", err)
		return
	}
	if len(in.Email) < 1 {
		utils.ResponseServerError(gctx, "邮箱不可为空", nil)
		return
	}
	if len(in.Code) < 1 {
		utils.ResponseServerError(gctx, "验证码不可为空", nil)
		return
	}

	query := &dbmodels.AccountTable{UName: in.Email}
	account := &dbmodels.AccountTable{}
	if err := s.middleware.DB.Where(query).First(account).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ResponseServerError(gctx, "用户不存在，请发送验证码到邮箱", nil)
			return
		}
		utils.ResponseServerError(gctx, "查询用户信息出错", err)
		return
	}
	err := otp.Validate(account.UPass, in.Code)
	if err != nil {
		utils.ResponseServerError(gctx, "验证码有误", nil)
		return
	}
	auth := account.Pk
	token, err := middleware.GenerateToken(auth)
	if err != nil {
		utils.ResponseServerError(gctx, "生成token出错: %w", err)
		return
	}

	logrus.Debugln("LoginResponse", token)
	expire := time.Now().Add(time.Hour * 24 * 7)
	cookieExpire := int(expire.Sub(time.Now()).Seconds())
	gctx.SetSameSite(http.SameSiteStrictMode)
	gctx.SetCookie("c", token, cookieExpire, "/", gctx.Request.Host, true, true)

	utils.ResponseData(gctx, http.StatusOK, nil)
}

type sessionPostIn struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

func (s *accountHandler) HandlePersonal(gctx *gin.Context) {
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}

	userInfo := &dbmodels.AccountTable{
		Pk: auth,
	}
	if err := s.middleware.DB.First(userInfo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ClientPage(gctx, http.StatusNotFound, nil)
			return
		}
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	photoUrl := ""
	if len(userInfo.Photo.String) > 0 {
		photoUrl = config.FileUrl + userInfo.Photo.String
	}
	gctx.HTML(http.StatusOK, "account/personal.gohtml", gin.H{
		"pk":       userInfo.Pk,
		"email":    userInfo.UName,
		"photo":    photoUrl,
		"nickname": userInfo.NickName,
		"regtime":  utils.FmtTime(userInfo.CreateTime),
		"uptime":   utils.FmtTime(userInfo.UpdateTime),
	})
}

// 修改个人资料
func (s *accountHandler) HandleEdit(gctx *gin.Context) {
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}

	userInfo := &dbmodels.AccountTable{
		Pk: auth,
	}
	if err := s.middleware.DB.First(userInfo).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ClientPage(gctx, http.StatusNotFound, nil)
			return
		}
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	gctx.HTML(http.StatusOK, "account/edit.gohtml", gin.H{
		"data": map[string]interface{}{
			"pk":       userInfo.Pk,
			"email":    userInfo.UName,
			"nickname": userInfo.NickName,
			"login":    len(auth) > 0,
		},
	})
}

func isImageExt(fileExt string) bool {
	if fileExt == ".png" ||
		fileExt == ".jpg" ||
		fileExt == ".jpeg" ||
		fileExt == ".bmp" ||
		fileExt == ".gif" ||
		fileExt == ".webp" ||
		fileExt == ".psd" ||
		fileExt == ".svg" ||
		fileExt == ".tiff" {
		return true
	}
	return false
}

// 修改个人资料
func (s *accountHandler) HandleEditPut(gctx *gin.Context) {
	photoHeader, err := gctx.FormFile("photoFile")
	auth, err := middleware.GetAuth(gctx)
	if err != nil || len(auth) < 1 {
		utils.ResponseServerError(gctx, "无效用户信息: %w", err)
		return
	}
	photoLocation := ""
	// 上传图片
	if err == nil && photoHeader != nil {
		if photoHeader.Size > 2048*1024*1024 {
			utils.ResponseMessage(gctx, http.StatusBadRequest, "文件过大")
			return
		}
		fileExt := filepath.Ext(photoHeader.Filename)
		fileMime := mime.TypeByExtension(fileExt)
		if !isImageExt(fileExt) || len(fileMime) < 1 {
			utils.ResponseMessage(gctx, http.StatusBadRequest, "未知图片格式")
			return
		}
		logrus.Debug("fileExt", fileExt)

		photoFile, err := photoHeader.Open()
		if err != nil {
			utils.ResponseError(gctx, http.StatusInternalServerError, err)
			return
		}

		logrus.Debug("photoFile", photoHeader.Filename)
		fileKey := strings.ReplaceAll(uuid.New().String(), "-", "")[:16]
		fileKey = fmt.Sprintf("%s/%s%s", auth, fileKey, fileExt)

		result, err := s.middleware.AwsS3.Uploader.Upload(context.TODO(), &s3.PutObjectInput{
			Bucket:      aws.String("sfxfile"),
			Key:         aws.String(fileKey),
			Body:        photoFile,
			ContentType: aws.String(fileMime),
		})
		if err != nil {
			utils.ResponseError(gctx, http.StatusInternalServerError, err)
			return
		}
		photoLocation = "/" + fileKey

		logrus.Debugln("s3 upload result", result.Location)
	}

	nickname := gctx.PostForm("nickname")

	if len(nickname) < 1 {
		utils.ResponseMessage(gctx, http.StatusBadRequest, "参数有误")
		return
	}
	updateQuery := &dbmodels.AccountTable{Pk: auth}
	updateBody := &dbmodels.AccountTable{
		NickName:   nickname,
		UpdateTime: time.Now(),
	}
	if len(photoLocation) > 0 {
		updateBody.Photo = sql.NullString{String: photoLocation, Valid: true}
	}
	if err := s.middleware.DB.Where(updateQuery).Updates(updateBody).Error; err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": auth,
	})
}

func (s *accountHandler) RegisterRouter(router *gin.Engine, name string) {
	router.POST("/account/login", s.LoginByOTPCode)
	router.POST("/account/verify", s.SendOTPCode)
	router.GET("/account/image", s.LoadImage)
	router.GET("/account/personal", s.HandlePersonal)
	router.GET("/account/edit", s.HandleEdit)
	router.PUT("/account/edit", s.HandleEditPut)
}

func NewAccountResource(middleware *middleware.ServerMiddleware) IResource {
	return &accountHandler{
		middleware,
	}
}
