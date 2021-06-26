package server

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gorilla/csrf"
	"sujiserv/config"
	"sujiserv/server/handlers"
	"sujiserv/server/handlers/resources"
	"sujiserv/server/middleware"

	"github.com/gin-gonic/gin"
	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	"github.com/tdewolff/minify/v2/html"
	"github.com/tdewolff/minify/v2/js"
	"github.com/tdewolff/minify/v2/json"
	"github.com/tdewolff/minify/v2/svg"
	"github.com/tdewolff/minify/v2/xml"
)

func newMinify() *minify.M {
	m := minify.New()
	m.AddFunc("text/css", css.Minify)
	m.AddFunc("text/html", html.Minify)
	m.AddFunc("image/svg+xml", svg.Minify)
	m.AddFuncRegexp(regexp.MustCompile("^(application|text)/(x-)?(java|ecma)script$"), js.Minify)
	m.AddFuncRegexp(regexp.MustCompile("[/+]json$"), json.Minify)
	m.AddFuncRegexp(regexp.MustCompile("[/+]xml$"), xml.Minify)
	return m
}

type WebServer struct {
	router     *gin.Engine
	middleware *middleware.ServerMiddleware
	resources  map[string]resources.IResource
}

func NewWebServer(smw *middleware.ServerMiddleware) (*WebServer, error) {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(smw.Auth.MiddlewareFunc())
	server := &WebServer{
		router:     router,
		middleware: smw,
		resources:  make(map[string]resources.IResource)}
	router.SetFuncMap(template.FuncMap{
		"jsLink":   jsLink,
		"cssLink":  cssLink,
		"eqString": eqString,
	})
	router.LoadHTMLGlob("web/templates/*.html")

	router.NoRoute(handlers.HandleNotFound)

	//	router.GET("/", handlers.HandleIndex2)
	//router.StaticFile("/favicon.ico", "./web/favicon.ico")
	//router.GET("/new", handlers.HandleNew)
	//router.POST("/create", handlers.HandleCreate)
	//router.GET("/show/:uk/:pk", handlers.HandleShow)
	return server, nil
}

func (s *WebServer) Init() error {
	indexHandler := handlers.NewIndexHandler(s.middleware)
	s.router.GET("/", indexHandler.Handle)

	s.resources["post"] = resources.NewArticleResource(s.middleware)
	s.resources["account"] = resources.NewAccountResource(s.middleware)

	for name, resource := range s.resources {
		resource.RegisterRouter(s.router, name)
	}
	return nil
}

func (s *WebServer) Start() error {
	port := os.Getenv("PORT")
	if len(port) < 1 {
		port = "8080"
	}
	handler := csrf.Protect([]byte(config.CSRFToken),
		csrf.CookieName("r"), csrf.RequestHeader("r"))(s)

	//if config.Release() {
	//	m := newMinify()
	//	handler = m.Middleware(handler)
	//}

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
	s.router.ServeHTTP(w, r)
}
