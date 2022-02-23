package config

import (
	"fmt"
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
	configMap, err := GetConfigurationMap()
	if err != nil {
		logrus.Fatalln("获取appconfig配置出错: %w", err)
	}

	resPath := configMap[envResPath]
	if len(resPath) > 0 {
		ResourceUrl = resPath
	}
	DBDSN = configMap["DSN"]
	if len(DBDSN) < 1 {
		logrus.Fatalln("数据库未配置")
	}

	REDIS = configMap["REDIS"]
	if len(REDIS) < 1 {
		logrus.Fatalln("Redis未配置")
	}

	mode := configMap["MODE"]
	if len(mode) > 0 {
		GINMODE = mode
	}

	MailHost = configMap["MAIL_HOST"]
	mailPortStr := configMap["MAIL_PORT"]
	if len(mailPortStr) > 0 {
		if mailPort, err := strconv.Atoi(mailPortStr); err != nil {
			logrus.Fatalln("转换邮件端口出错: %w", err)
		} else {
			MailPort = mailPort
		}
	}
	MailUser = configMap["MAIL_USER"]
	MailPassword = configMap["MAIL_PASSWORD"]
	if len(MailHost) < 1 || len(MailUser) < 1 || len(MailPassword) < 1 {
		logrus.Fatalln("邮件配置有误")
	}

	JWTKey = configMap["JWT_KEY"]
	CSRFToken = configMap["CSRF_TOKEN"]
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
	QuestKey = configMap["QUEST_KEY"]
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
