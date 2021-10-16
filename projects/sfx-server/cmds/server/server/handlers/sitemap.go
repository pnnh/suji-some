package handlers

import (
	"fmt"

	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/config"
	"sfxserver/server/middleware"
	"sfxserver/server/utils"

	"github.com/gin-gonic/gin"
	"github.com/snabb/sitemap"
)

type sitemapHandler struct {
	md *middleware.ServerMiddleware
}

func (s *sitemapHandler) HandleSitemap(gctx *gin.Context) {
	tables := make([]*dbmodels.ArticleTable, 0)
	result := s.md.DB.Order("update_time desc").Limit(320).Find(&tables)
	if result.Error != nil {
		utils.ResponseServerError(gctx, "查询文章列表出错", result.Error)
		return
	}

	sm := sitemap.New()
	sm.Add(&sitemap.URL{
		Loc: config.ServerUrl + "/",
	})
	for _, v := range tables {
		sm.Add(&sitemap.URL{
			Loc: fmt.Sprintf("%s/article/read/%s", config.ServerUrl,
				v.Pk),
			LastMod: &v.UpdateTime,
		})
	}
	if _, err := sm.WriteTo(gctx.Writer); err != nil {
		utils.ResponseServerError(gctx, "写入响应出错", err)
		return
	}
}

func NewSitemapHandler(md *middleware.ServerMiddleware) *sitemapHandler {
	return &sitemapHandler{
		md: md,
	}
}
