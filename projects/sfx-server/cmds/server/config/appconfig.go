package config

import (
	"context"
	"log"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/appconfig"
)

func loadAwsConfig() string {
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

func GetConfigurationMap() (map[string]string, error) {
	var cmdEnv []string

	awsConfig := loadAwsConfig()
	awsEnvs := strings.Split(awsConfig, "\n")
	for _, e := range awsEnvs {
		cmdEnv = append(cmdEnv, e)
	}
	// 系统环境变量可以覆盖掉默认配置
	osEnv := os.Environ()
	for _, e := range osEnv {
		cmdEnv = append(cmdEnv, e)
	}
	configMap := make(map[string]string)
	for _, e := range cmdEnv {
		index := strings.Index(e, "=")
		if index > 0 {
			configMap[e[:index]] = e[index+1:]
		}
	}

	return configMap, nil
}
