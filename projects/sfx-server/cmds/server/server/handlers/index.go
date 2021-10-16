package handlers

import (
	"net/http"

	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/server/middleware"
	"sfxserver/server/models"
	"sfxserver/server/utils"

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
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错", err)
		return
	}
	gctx.HTML(http.StatusOK, "index/index.gohtml", gin.H{
		"list":  list,
		"count": result.RowsAffected,
		"data": gin.H {
			"login": len(auth) > 0,
		},
	})
}

func NewIndexHandler(md *middleware.ServerMiddleware) *indexHandler {
	return &indexHandler{
		md: md,
	}
}

func ClientPage(gctx *gin.Context) {
	utils.ClientPage(gctx, http.StatusOK, nil)
}
