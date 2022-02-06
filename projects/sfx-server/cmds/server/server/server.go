package server

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"sfxserver/config"
	"sfxserver/server/handlers"
	"sfxserver/server/handlers/resources"
	"sfxserver/server/middleware"
	"sfxserver/server/utils"

	"github.com/gin-gonic/gin"
)

type WebServer struct {
	router     *gin.Engine
	middleware *middleware.ServerMiddleware
	resources  map[string]resources.IResource
}

func NewWebServer(smw *middleware.ServerMiddleware) (*WebServer, error) {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	server := &WebServer{
		router:     router,
		middleware: smw,
		resources:  make(map[string]resources.IResource)}
	router.SetFuncMap(utils.FuncMap())
	router.LoadHTMLGlob("web/templates/**/*.gohtml")

	router.NoRoute(handlers.ClientPage)

	return server, nil
}

func (s *WebServer) Init() error {
	indexHandler := handlers.NewIndexHandler(s.middleware)
	s.router.GET("/", indexHandler.Handle)
	sitemapHandler := handlers.NewSitemapHandler(s.middleware)
	s.router.GET("/seo/sitemap", sitemapHandler.HandleSitemap)
	s.router.GET("/utils/random/password", handlers.HandleRandomPassword)
	s.router.GET("/utils/encrypt/md5", handlers.HandleCalcMd5)
	s.router.GET("/utils/timestamp", handlers.HandleTimestamp)
	s.router.GET("/work/calendar", handlers.HandleCalendar)
	s.router.GET("/about", handlers.HandleAbout)

	s.resources["article"] = resources.NewArticleResource(s.middleware)
	s.resources["account"] = resources.NewAccountResource(s.middleware)
	s.resources["user"] = resources.NewUserResource(s.middleware)
	s.resources["post"] = resources.NewPostResource(s.middleware)

	for name, resource := range s.resources {
		resource.RegisterRouter(s.router, name)
	}
	// 在开发环境下，通过反向代理指向资源服务，避免一些js文件找不到
	if config.Debug() {
		s.router.NoRoute(devHandler)
	}
	return nil
}

func (s *WebServer) Start() error {
	port := os.Getenv("PORT")
	if len(port) < 1 {
		port = "8080"
	}
	var handler http.Handler = s

	// 暂时禁言csrf保护，因为它只支持从header、form表单的地方获取，不能从cookie中获取
	// kotlin ktor框架将这里的header视为非法，所以ktor的csrf校验无法通过
	// 考虑用移至的方式校验
	//handler := csrf.Protect([]byte(config.CSRFToken),
	//	csrf.CookieName("r"))(s)

	if config.Release() {
		handler = Minify(s)
	}

	serv := &http.Server{
		Addr:           ":" + port,
		Handler:        handler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	if err := serv.ListenAndServe(); err != nil {
		return fmt.Errorf("服务出错停止: %w", err)
	}
	return nil
}

func (s *WebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//if config.Debug() && strings.HasPrefix(r.URL.Path, "/blog/") {
	//	devBlogHandler(w, r)
	//	return
	//}
	s.router.ServeHTTP(w, r)
}
