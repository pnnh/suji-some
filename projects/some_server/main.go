package main

import (
	"log"

	"github.com/sirupsen/logrus"
	"sujiserv/application"
	"sujiserv/server/utils"
)

func main() {
	//some.CPrintln()
	key := "dae[8<Fj1Y8%RNk}SFuG_Q/.!5-%@?Lp"
	out, err := utils.AesEncrypt("E3rTwpKAEAA", []byte(key))
	log.Println("jjj", out, err)
	a, b := utils.AesDecrypt(out, []byte(key))
	log.Println("jjj22", a, b)
	return
	app := application.NewApplication()

	if err := app.Init(); err != nil {
		logrus.Fatalln("应用程序初始化出错: %w", err)
	}
	if err := app.Start(); err != nil {
		logrus.Fatalln("应用程序执行出错: %w", err)
	}
}
