package resources

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/csrf"
	dbmodels "sujiserv/application/services/db/models"
	"sujiserv/config"
	"sujiserv/server/handlers/otp"
	"sujiserv/server/middleware"
	"sujiserv/server/utils"

	"gorm.io/gorm"

	"github.com/gin-gonic/gin"
)

type accountHandler struct {
	middleware *middleware.ServerMiddleware
}

// Index 登录或注册页面
func (s *accountHandler) Index(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "client.html", gin.H{
		"title": "用户登录",
		"data": gin.H{
			"csrf": csrf.Token(gctx.Request),
		},
	})
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
	verify := fmt.Sprintf("%d,%s", nowUnix, "E3rTwpKAEAA")
	questVerify, err := utils.AesEncrypt(verify, []byte(config.QuestKey))
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	otpUrl := fmt.Sprintf("%s/account/otp/image?v=%s", config.QuestApiUrl, questVerify)

	//logrus.Debugln("otpUrl", otpUrl)
	mailBody, err := s.middleware.Templs.Execute("mail.html", gin.H{
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

type accountPostIn struct {
	Email string `json:"email"`
}

// 通过OTP验证码登录
func (s *accountHandler) LoginByOTPCode(gctx *gin.Context) {
	s.middleware.Auth.Login(gctx)

}

func (s *accountHandler) RegisterRouter(router *gin.Engine, name string) {
	name = "account"
	router.GET(fmt.Sprintf("/%s/login", name), s.Index)
	router.POST(fmt.Sprintf("/%s/login", name), s.LoginByOTPCode)
	router.POST(fmt.Sprintf("/%s/verify", name), s.SendOTPCode)
}

func NewAccountResource(middleware *middleware.ServerMiddleware) IResource {
	return &accountHandler{
		middleware,
	}
}
