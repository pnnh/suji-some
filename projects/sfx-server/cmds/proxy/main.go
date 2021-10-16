package main

import (
	"io"
	"os"
	"os/exec"
	"strings"

	"github.com/sirupsen/logrus"
)

func main() {
	logrus.SetLevel(logrus.DebugLevel)
	logrus.Infoln("hello")

	//getConfig()

	cmdName := "./sfxserver"

	cmdIn, cmdOut, err := os.Pipe()
	if err != nil {
		logrus.Fatalln("创建管道出错: %w", err)
	}

	cmd := exec.Command(cmdName)
	cmd.Stdout = cmdOut
	cmd.Stderr = cmdOut

	go func() {
		if _, err := io.Copy(os.Stdout, cmdIn); err != nil {
			logrus.Fatalln("同步子进程标准输出出错: %w", err)
		}
	}()

	cmdEnv := getEnvironment()
	if len(cmdEnv) > 0 {
		cmd.Env = cmdEnv
	}
	err = cmd.Run()
	if err != nil {
		logrus.Fatalln("子进程执行出错: %w", err)
	}
	logrus.Println("hhhh")

	return

}

func getEnvironment() []string {
	env := os.Environ()
	var cmdEnv []string

	for _, e := range env {
		cmdEnv = append(cmdEnv, e)
	}
	config := getConfig()
	awsEnvs := strings.Split(config, "\n")
	for _, e := range awsEnvs {
		cmdEnv = append(cmdEnv, e)
	}
	cmdEnv = append(cmdEnv, "B=hello")

	return cmdEnv
}
