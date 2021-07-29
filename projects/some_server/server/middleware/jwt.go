package middleware

import (
	"fmt"
	"log"
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"sujiserv/application/services/db"
	dbmodels "sujiserv/application/services/db/models"
	"sujiserv/config"
	"sujiserv/server/handlers/otp"
	"sujiserv/server/utils"
)

type authMiddleware struct {
	db *db.DBService
	jwtMiddleware *jwt.GinJWTMiddleware
}

func (s *authMiddleware) Login(gctx *gin.Context) {
	s.jwtMiddleware.LoginHandler(gctx)
}

func (s *authMiddleware) GetAuth(gctx *gin.Context) *Auth {
	authValue, ok := gctx.Get("auth")
	if !ok {
		return nil
	}
	if auth, ok := authValue.(*Auth); ok {
		return auth
	}
	return nil
}

func (s *authMiddleware) MiddlewareFunc() gin.HandlerFunc {
	return s.jwtMiddleware.MiddlewareFunc()
}

func (s *authMiddleware) NeedLogin(gctx *gin.Context) {
	authValue, ok := gctx.Get("auth")
	log.Println("NeedLogin", authValue, ok)
	unAuth := false
	if !ok || authValue == nil {
		unAuth = true
	} else if auth, ok := authValue.(*Auth); !ok {
		unAuth = true
	} else if len(auth.UName) < 1 || auth.Code != http.StatusOK {
		unAuth = true
	}
	if unAuth {
		//gctx.HTML(http.StatusOK, "index/client.html", gin.H{
		//	"title":  "未授权",
		//	"status": http.StatusUnauthorized,
		//})
		utils.ClientPage(gctx, http.StatusUnauthorized,nil)
		gctx.Abort()
	}
}

var identityKey = "pk"

type Auth struct {
	UName string
	Code int
	Message string
}

type sessionPostIn struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

func (s *authMiddleware) Authenticator(gctx *gin.Context) (interface{}, error) {
	in := &sessionPostIn{}
	if err := gctx.ShouldBindJSON(in); err != nil {
		return nil, err
	}
	if len(in.Email) < 1 {
		utils.ResponseServerError(gctx, "邮箱不可为空", nil)
		return nil, nil
	}
	if len(in.Code) < 1 {
		utils.ResponseServerError(gctx, "验证码不可为空", nil)
		return nil, nil
	}

	query := &dbmodels.AccountTable{UName: in.Email}
	account := &dbmodels.AccountTable{}
	if err := s.db.Where(query).First(account).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ResponseServerError(gctx, "用户不存在，请发送验证码到邮箱", nil)
			return nil, nil
		}
		utils.ResponseServerError(gctx, "查询用户信息出错", err)
		return nil, nil
	}
	err := otp.Validate(account.UPass, in.Code)
	if err != nil {
		utils.ResponseServerError(gctx, "验证码有误", nil)
		return nil, nil
	}

	return &Auth{
		UName: account.Pk, Code: http.StatusOK,
	}, nil
}

func (s *authMiddleware) LoginResponse(gctx *gin.Context, status int, token string, expire time.Time) {
	logrus.Debugln("LoginResponse", status, token, expire)
	//startTime := time.Unix(1577808000, 0) // 对应 2020-01-01 0:0:0.000
	//cookieExpire := int(expire.Sub(time.Now()).Seconds())
	//gctx.SetSameSite(http.SameSiteStrictMode)
	//gctx.SetCookie("c", token, cookieExpire, "/", gctx.Request.Host, true, true)
	//utils.ResponseData(gctx, status, gin.H{
	//"f": token,
	//"x": int(expire.Sub(startTime).Seconds()), // 伪装目的，自开始时间以来的秒数
	//})
}

func (s *authMiddleware) Authorizator(data interface{}, gctx *gin.Context) bool {
	logrus.Debugln("Authorizator", data)
	if v, ok := data.(*Auth); ok && len(v.UName) > 0 {
		gctx.Set("auth", v)
		return true
	}
	return false
}

func (s *authMiddleware) Unauthorized(gctx *gin.Context, code int, message string) {
	logrus.Debugln("Unauthorized", code, message)
	auth := &Auth{
		UName: "", Code: code, Message: message,
	}
	gctx.Set("auth", auth)
	//gctx.HTML(http.StatusOK, "client.html", gin.H{
	//	"title":  "未授权",
	//	"status": http.StatusUnauthorized,
	//})
}

func NetAuthMiddleware(db *db.DBService) (*authMiddleware, error) {
	s := &authMiddleware{db: db}

	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       config.JWTRealm,
		Key:         []byte(config.JWTKey),
		Timeout:     time.Hour * 24,
		MaxRefresh:  time.Hour * 30,
		IdentityKey: identityKey,
		SendAuthorization: false,
		SendCookie: true,
		CookieSameSite: http.SameSiteLaxMode,
		CookieHTTPOnly: true,
		SecureCookie: true,
		CookieName: "c",
		DisabledAbort: true,
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if v, ok := data.(*Auth); ok {
				return jwt.MapClaims{
					identityKey: v.UName,
				}
			}
			return jwt.MapClaims{}
		},
		LoginResponse: s.LoginResponse,
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			if uname, ok := claims[identityKey].(string); ok {
				return &Auth{
					UName: uname,
					Code: http.StatusOK,
				}
			}
			return nil
		},
		Authenticator: s.Authenticator,
		Authorizator:  s.Authorizator,
		Unauthorized:  s.Unauthorized,
		TokenLookup:   "cookie: c", // 故意简化起混淆作用
		TimeFunc:      time.Now,
	})

	if err != nil {
		return nil, fmt.Errorf("JWT Error: %w", err)
	}
	s.jwtMiddleware = authMiddleware
	// 已在New方法中调用过了
	//errInit := authMiddleware.MiddlewareInit()
	//
	//if errInit != nil {
	//	return nil, fmt.Errorf("authMiddleware.MiddlewareInit() Error: %w", errInit)
	//}

	return s, nil
}
