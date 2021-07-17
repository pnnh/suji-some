package handlers

import (
	"net/http"

	dbmodels "sujiserv/application/services/db/models"
	"sujiserv/server/middleware"
	"sujiserv/server/models"
	"sujiserv/server/utils"

	"github.com/gin-gonic/gin"
)

type indexHandler struct {
	md *middleware.ServerMiddleware
}

func (s *indexHandler) Handle(gctx *gin.Context) {
	tables := make([]*dbmodels.ArticleTable, 0)
	result := s.md.DB.Order("update_time desc").Limit(64).Find(&tables)
	if result.Error != nil {
		utils.ResponseServerError(gctx, "查询文章列表出错", result.Error)
		return
	}
	list := make([]*models.ArticleView, len(tables))
	for k, v := range tables {
		list[k] = models.ParseArticleView(v)
	}
	auth := s.md.Auth.GetAuth(gctx)
	gctx.HTML(http.StatusOK, "index.html", gin.H{
		"title": "首页",
		"list":  list,
		"count": result.RowsAffected,
		"data": gin.H{
			"login": auth != nil && len(auth.UName) > 0,
		},
	})
}

func NewIndexHandler(md *middleware.ServerMiddleware) *indexHandler {
	return &indexHandler{
		md: md,
	}
}

func HandleNotFound(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "client.html", gin.H{
		"title":  "页面",
		//"status": http.StatusNotFound,
	})
}
