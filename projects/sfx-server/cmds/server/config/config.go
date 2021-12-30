package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"sfxserver/gen"
)

const (
	envResPath = "RES_PATH"
)

var DBDSN = ""
var REDIS = ""
var GINMODE = "release"
var ISSUER = "sfx.xyz" // TOTP发行机构
var JWTRealm = "sfx.xyz"
var JWTKey = ""
var CSRFToken = ""
var ServerUrl = "https://sfx.xyz"
var ResourceUrl = "https://res.sfx.xyz"
var FileUrl = "https://file.sfx.xyz"
var DefaultPhotoUrl = ""
var QuestKey = ""
var RunVersion = gen.RunVersion // 当前程序版本标识，在构建时自动生成

var (
	MailHost     = ""
	MailPort     = 587
	MailUser     = ""
	MailPassword = ""
)

func init() {
	resPath := os.Getenv(envResPath)
	if len(resPath) > 0 {
		ResourceUrl = resPath
	}
	DBDSN = os.Getenv("DSN")
	if len(DBDSN) < 1 {
		logrus.Fatalln("数据库未配置")
	}

	REDIS = os.Getenv("REDIS")
	if len(REDIS) < 1 {
		logrus.Fatalln("Redis未配置")
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
	if Debug() {
		ServerUrl = "http://127.0.0.1:5000"
		ResourceUrl = "http://127.0.0.1:3000"
	}
	QuestKey = os.Getenv("QUEST_KEY")
	if len(QuestKey) < 1 {
		logrus.Fatalln("未配置QUEST_KEY")
	}
	DefaultPhotoUrl = fmt.Sprintf("%s%s", ResourceUrl, "/images/default.png")
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
