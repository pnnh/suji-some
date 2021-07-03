package config

import (
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

const DBKey = "pg"

var DBDSN = "host=localhost user=postgres password=example dbname=sfxdb port=5432 sslmode=disable TimeZone=Asia/Shanghai"
var GINMODE = "release"
var ISSUER = "sfx.xyz" // TOTP发行机构
var JWTRealm = "sfx.xyz"
var JWTKey = ""
var CSRFToken = ""

var (
	MailHost     = ""
	MailPort     = 587
	MailUser     = ""
	MailPassword = ""
)

func init() {
	dsn := os.Getenv("DSN")
	if len(dsn) > 0 {
		DBDSN = dsn
	}

	mode := os.Getenv("MODE")
	if len(mode) > 0 {
		GINMODE = mode
	}

	MailHost = os.Getenv("MAIL_HOST")
	mailPortStr := os.Getenv("MAIL_PORT")
	if len(mailPortStr) > 0 {
		if mailPort, err := strconv.Atoi(mailPortStr); err != nil {
			logrus.Fatalln("转换邮件端口出错: %w", err)
		} else {
			MailPort = mailPort
		}
	}
	MailUser = os.Getenv("MAIL_USER")
	MailPassword = os.Getenv("MAIL_PASSWORD")
	if len(MailHost) < 1 || len(MailUser) < 1 || len(MailPassword) < 1 {
		logrus.Fatalln("邮件配置有误")
	}

	JWTKey = os.Getenv("JWT_KEY")
	CSRFToken = os.Getenv("CSRF_TOKEN")
	if len(JWTKey) < 1 {
		JWTKey = uuid.New().String()[:32]
	}
	if len(CSRFToken) < 1 {
		CSRFToken = uuid.New().String()[:32]
	}
}

func Debug() bool {
	return GINMODE == gin.DebugMode
}

func Test() bool {
	return GINMODE == gin.TestMode
}

func Release() bool {
	return GINMODE != gin.DebugMode && GINMODE != gin.TestMode
}