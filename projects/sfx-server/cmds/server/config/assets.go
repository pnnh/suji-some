package config

import (
	"fmt"
	"os"
	"strings"
)

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
