package main

import (
	"sujiserv/application"
	"sujiserv/clibs/some"

	"github.com/sirupsen/logrus"
)

func main() {
	some.CPrintln()
	return
	app := application.NewApplication()

	if err := app.Init(); err != nil {
		logrus.Fatalln("应用程序初始化出错: %w", err)
	}
	if err := app.Start(); err != nil {
		logrus.Fatalln("应用程序执行出错: %w", err)
	}
}
