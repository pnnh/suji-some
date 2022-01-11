package application

import (
	"fmt"
	"sync"

	"sfxserver/application/services"
	"sfxserver/application/services/db"
	"sfxserver/application/services/email"
	"sfxserver/application/services/templs"
	"sfxserver/config"
	"sfxserver/server"
	"sfxserver/server/middleware"

	"github.com/gin-gonic/gin"

	"github.com/sirupsen/logrus"
)

type Application struct {
	services map[string]IService
}

func NewApplication() *Application {
	app := &Application{services: make(map[string]IService)}

	return app
}

func (app *Application) Use(key string, serv IService) {
	app.services[key] = serv
}

func (app *Application) initMiddleware() (*middleware.ServerMiddleware, error) {
	mailSvc := email.NewService()
	app.Use("mail", mailSvc)
	sqlsvc := db.NewSqlxService(config.DBDSN)
	app.Use("sqlx", sqlsvc)
	s3Svc := services.NewAwsS3Service()
	app.Use("aws-s3", s3Svc)
	redisSvc := services.NewRedisService()
	app.Use("redis", redisSvc)
	tmpls := templs.NewService()
	app.Use("templs", tmpls)

	serverMiddleware := &middleware.ServerMiddleware{
		Mail:        mailSvc,
		Templs:      tmpls,
		SqlxService: sqlsvc,
		AwsS3:       s3Svc,
		Redis:       redisSvc,
	}
	return serverMiddleware, nil
}

func (app *Application) Init() error {
	gin.SetMode(gin.ReleaseMode)
	if config.GINMODE == gin.DebugMode {
		gin.SetMode(gin.DebugMode)
		logrus.SetLevel(logrus.DebugLevel)
	}
	mw, err := app.initMiddleware()
	if err != nil {
		return err
	}
	webServer, err := server.NewWebServer(mw)
	if err != nil {
		return fmt.Errorf("创建web server出错: %w", err)
	}
	app.Use("server", webServer)
	return nil
}

func (app *Application) Start() error {
	wg := sync.WaitGroup{}
	for k, v := range app.services {
		if err := v.Init(); err != nil {
			return fmt.Errorf("初始化服务出错: %s %w", k, err)
		}
		wg.Add(1)
		go func(serv IService) {
			defer wg.Done()
			if err := serv.Start(); err != nil {
				logrus.Fatalln("服务运行出错: %w", err)
			}
		}(v)
	}
	wg.Wait()
	return nil
}
