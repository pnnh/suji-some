package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 关于页面
func HandleAbout(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "about/about.gohtml", gin.H{})
}
