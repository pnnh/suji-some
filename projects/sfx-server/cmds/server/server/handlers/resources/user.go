package resources

import (
	"net/http"

	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/server/middleware"
	"sfxserver/server/utils"

	"github.com/gin-gonic/gin"
)

type userHandler struct {
	middleware *middleware.ServerMiddleware
}

func (s *userHandler) HandleInfo(gctx *gin.Context) {
	// 登录判断
	_, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}

	pk := gctx.Param("pk")
	userInfo := &dbmodels.AccountTable{
		Pk: pk,
	}
	sqlText := `select accounts.* from accounts where pk = $1;`
	if err := s.middleware.SqlxService.Get(userInfo, sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错", err)
		return
	}
	photoUrl := GetPhotoOrDefault(userInfo.Photo.String)
	gctx.HTML(http.StatusOK, "user/info.gohtml", gin.H{
		"pk":          userInfo.Pk,
		"nickname":    userInfo.NickName,
		"description": userInfo.Description.String,
		"photo":       photoUrl,
		"regtime":     utils.FmtTime(userInfo.CreateTime),
	})
}

func (s *userHandler) RegisterRouter(router *gin.Engine, name string) {
	router.GET("/user/:pk", s.HandleInfo)
}

func NewUserResource(middleware *middleware.ServerMiddleware) IResource {
	return &userHandler{
		middleware,
	}
}
