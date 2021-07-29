package utils

import (
	"fmt"
	"html/template"
	"time"

	"github.com/gin-gonic/gin"
	"sujiserv/config"
)

func FmtTimeUnix(unix int64) string {
	t := time.Unix(unix, 0)
	return t.Format("2006年01月02日 15:04")
}

func FmtTime(t time.Time) string {
	return t.Format("2006年01月02日 15:04")
}

func JsLink(resUrl string, proResUrl string) template.HTML {
	jsUrl := fmt.Sprintf("%s%s", config.ResourceUrl, proResUrl)
	if gin.Mode() == gin.DebugMode {
		jsUrl = fmt.Sprintf("http://localhost:3000%s", resUrl)
	}
	htmlText := template.HTML(fmt.Sprintf("<script type='module' src='%s'></script>", jsUrl))
	return htmlText
}

func CssLink(resUrl string, proResUrl string) template.HTML {
	cssUrl := fmt.Sprintf("%s%s", config.ResourceUrl, proResUrl)
	if gin.Mode() == gin.DebugMode {
		cssUrl = fmt.Sprintf("http://localhost:3000%s", resUrl)
	}
	htmlText := template.HTML(fmt.Sprintf("<link rel='stylesheet' type='text/css' href='%s' />", cssUrl))
	return htmlText
}

func EqString(a interface{}, b string) bool {
	if fmt.Sprintf("%s", a) == b {
		return true
	}
	return false
}

func ClientPage(gctx *gin.Context, status int, title string, data gin.H) {
	h := gin.H{
		"status":  status,
		"title":   title,
	}
	if data != nil {
		h["data"] = data
	}
	gctx.HTML(status, "index/client.html", h)
}

func FuncMap() template.FuncMap {
	funcMap := template.FuncMap{
		"jsLink":      JsLink,
		"cssLink":     CssLink,
		"eqString":    EqString,
		"fmtTime":     FmtTime,
		"fmtTimeUnix": FmtTimeUnix,
	}
	return funcMap
}
