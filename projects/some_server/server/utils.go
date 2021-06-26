package server

import (
	"fmt"
	"html/template"
	"os"

	"github.com/gin-gonic/gin"
)

var (
	envResPath = "RES_PATH"
)

var (
	varResPath = "https://res.sfx.xyz"
)

func init() {
	resPath := os.Getenv(envResPath)
	if len(resPath) > 0 {
		varResPath = resPath
	}
}

func jsLink(resUrl string, proResUrl string) template.HTML {
	jsUrl := fmt.Sprintf("%s%s", varResPath, proResUrl)
	if gin.Mode() == gin.DebugMode {
		jsUrl = fmt.Sprintf("http://localhost:3000%s", resUrl)
	}
	htmlText := template.HTML(fmt.Sprintf("<script type='module' src='%s'></script>", jsUrl))
	return htmlText
}

func cssLink(resUrl string, proResUrl string) template.HTML {
	cssUrl := fmt.Sprintf("%s%s", varResPath, proResUrl)
	if gin.Mode() == gin.DebugMode {
		cssUrl = fmt.Sprintf("http://localhost:3000%s", resUrl)
	}
	htmlText := template.HTML(fmt.Sprintf("<link rel='stylesheet' type='text/css' href='%s' />", cssUrl))
	return htmlText
}

func eqString(a interface{}, b string) bool {
	if fmt.Sprintf("%s", a) == b {
		return true
	}
	return false
}

