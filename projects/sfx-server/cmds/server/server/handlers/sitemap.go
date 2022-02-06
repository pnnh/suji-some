package handlers

import (
	"fmt"

	"sfxserver/config"
	"sfxserver/server/middleware"
	"sfxserver/server/models"
	"sfxserver/server/utils"

	"github.com/gin-gonic/gin"
	"github.com/snabb/sitemap"
)

type sitemapHandler struct {
	md *middleware.ServerMiddleware
}

func (s *sitemapHandler) HandleSitemap(gctx *gin.Context) {
	sqlText := `select articles.* from articles order by update_time desc limit 100;`
	var sqlResults []models.IndexArticleList

	if err := s.md.SqlxService.Select(&sqlResults, sqlText); err != nil {
		utils.ResponseServerError(gctx, "查询文章列表出错", err)
		return
	}

	sm := sitemap.New()
	sm.Add(&sitemap.URL{
		Loc: config.ServerUrl + "/",
	})
	for _, v := range sqlResults {
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
