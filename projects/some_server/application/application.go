package application

import (
	"fmt"
	"sync"

	"sujiserv/application/services/db"
	"sujiserv/application/services/email"
	"sujiserv/application/services/templs"
	"sujiserv/config"
	"sujiserv/server"
	"sujiserv/server/middleware"

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
	dbsvc := db.NewDBService(config.DBDSN)
	app.Use("db", dbsvc)
	authMiddleware, err := middleware.NetAuthMiddleware(dbsvc)
	if err != nil {
		return nil, fmt.Errorf("创建授权中间件出错: %w", err)
	}
	app.Use("auth", dbsvc)
	mailSvc := email.NewService()
	app.Use("mail", mailSvc)

	tmpls := templs.NewService()
	app.Use("templs", tmpls)

	serverMiddleware := &middleware.ServerMiddleware{
		DB:   dbsvc,
		Auth: authMiddleware,
		Mail: mailSvc,
		Templs: tmpls,
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
