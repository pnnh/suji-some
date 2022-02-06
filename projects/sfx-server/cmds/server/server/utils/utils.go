package utils

import (
	"fmt"
	"html/template"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"sfxserver/config"
)

func FmtTimeUnix(unix int64) string {
	t := time.Unix(unix, 0)
	return t.Format("2006年01月02日 15:04")
}

func FmtTime(t time.Time) string {
	return t.Format("2006年01月02日 15:04")
}

func ResLink(resUrl string, proResUrl string) template.HTML {
	jsUrl := fmt.Sprintf("%s%s", config.ResourceUrl, proResUrl)
	if gin.Mode() == gin.DebugMode {
		jsUrl = fmt.Sprintf("%s%s", config.ResourceUrl, resUrl)
	}
	if strings.ContainsAny(jsUrl, "?") {
		jsUrl += fmt.Sprintf("&v=%s", config.RunVersion)
	} else {
		jsUrl += fmt.Sprintf("?v=%s", config.RunVersion)
	}
	htmlText := template.HTML(jsUrl)
	return htmlText
}

func ResHost() string {
	return config.ResourceUrl
}

func EqString(a interface{}, b string) bool {
	if fmt.Sprintf("%s", a) == b {
		return true
	}
	return false
}

func ClientPage(gctx *gin.Context, status int, data gin.H) {
	if data == nil {
		data = gin.H{}
	}
	//data["csrf"] = csrf.Token(gctx.Request)
	if status != http.StatusOK {
		data["status"] = status
	}
	h := gin.H{
		"data": data,
	}
	gctx.HTML(status, "index/client.gohtml", h)
}

func FuncMap() template.FuncMap {
	funcMap := template.FuncMap{
		"resLink":     ResLink,
		"resHost":     ResHost,
		"eqString":    EqString,
		"fmtTime":     FmtTime,
		"fmtTimeUnix": FmtTimeUnix,
	}
	return funcMap
}

func GetPhotoOrDefault(photoPath string) string {
	if len(photoPath) > 0 {
		return config.FileUrl + photoPath
	}
	return config.DefaultPhotoUrl
}
