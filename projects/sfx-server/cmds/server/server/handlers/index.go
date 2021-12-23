package handlers

import (
	"net/http"
	"strings"

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
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错", err)
		return
	}
	sqlText := `select articles.*, accounts.nickname 
from articles left join accounts on articles.creator = accounts.pk 
order by update_time desc limit 64;`
	var sqlResults []dbmodels.IndexArticleList

	if err := s.md.SqlxService.Select(&sqlResults, sqlText); err != nil {
		utils.ResponseServerError(gctx, "查询文章列表出错", err)
		return
	}
	list := make([]*models.ArticleView, len(sqlResults))
	for k, v := range sqlResults {
		list[k] = &models.ArticleView{
			Pk:                  v.Pk,
			Title:               v.Title,
			Body:                v.Body,
			Creator:             v.Creator,
			Keywords:            v.Keywords.String,
			Description:         v.Description.String,
			UpdateTime:          v.UpdateTime,
			CreateTime:          v.CreateTime,
			CreateTimeFormatted: utils.FmtTime(v.CreateTime),
			UpdateTimeFormatted: utils.FmtTime(v.UpdateTime),
			KeywordsArray:       strings.Split(v.Keywords.String, ","),
			NickName:            v.NickName.String,
		}
	}
	gctx.HTML(http.StatusOK, "index/index.gohtml", gin.H{
		"list":  list,
		"count": len(sqlResults),
		"data": gin.H{
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
