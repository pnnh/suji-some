package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleRandomPassword(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "utils/random_password.gohtml", gin.H{
	})
}