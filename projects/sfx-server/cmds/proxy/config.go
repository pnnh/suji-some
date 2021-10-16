package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/appconfig"
)

const (
	envMODE = "MODE"
)

var MODE = "release"

func init() {
	mode := os.Getenv(envMODE)
	if len(mode) > 0 {
		MODE = mode
	}
}

func Debug() bool {
	return MODE == "debug"
}

func Release() bool {
	return !Debug()
}

func getConfig() string {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("ap-east-1"))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}
	svc := appconfig.NewFromConfig(cfg)

	hostname, err := os.Hostname()
	if err != nil {
		log.Fatalln("获取主机名出错", err)
	}

	in := &appconfig.GetConfigurationInput{
		Application:   aws.String("sfx"),
		ClientId:      aws.String(hostname),
		Configuration: aws.String("release.config"),
		Environment:   aws.String("release"),
	}
	if Debug() {
		in.Configuration = aws.String("debug.config")
		in.Environment = aws.String("debug")
	}
	out, err := svc.GetConfiguration(context.Background(), in)
	if err != nil {
		log.Fatalln("获取配置出错", err)
	}
	content := string(out.Content)
	return content
}
