package config

import (
	"fmt"
	"os"
	"strings"
)

var CssHtml string
var JsHtml string

// 这里资源文件的HTML标签是程序启动时从文件中获取的
// 在开发时是硬编码，而在CI流程中，前端资源编译后会覆盖默认的css和js标签文件
func initAssets() error {
	if data, err := loadResFile("web/gen/css.html"); err != nil {
		return fmt.Errorf("读取css配置出错: %w", err)
	} else {
		CssHtml = data
	}
	if data, err := loadResFile("web/gen/js.html"); err != nil {
		return fmt.Errorf("读取js配置出错: %w", err)
	} else {
		JsHtml = data
	}
	return nil
}

func loadResFile(path string) (string, error) {
	resUrl := ResourceUrl
	if Debug() {
		resUrl = "http://localhost:3000"
	}
	if data, err := os.ReadFile(path); err != nil {
		return "", fmt.Errorf("读取%s文件出错: %w", path, err)
	} else {
		output := strings.ReplaceAll(string(data), "href=\"", "href=\""+resUrl)
		output = strings.ReplaceAll(output, "src=\"", "src=\""+resUrl)
		return output, nil
	}
}