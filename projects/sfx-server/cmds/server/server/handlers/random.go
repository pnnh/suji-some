package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HandleRandomPassword 生成随机密码页面
func HandleRandomPassword(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "utils/random_password.gohtml", gin.H{})
}

// HandleCalcMd5 计算MD5页面
func HandleCalcMd5(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "utils/md5.gohtml", gin.H{})
}
