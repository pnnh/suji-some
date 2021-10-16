package config

import (
	"fmt"
	"os"
	"strings"
)

var CssHtml string
var JsHtml string

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