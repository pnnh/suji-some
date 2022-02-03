package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 日历页面
func HandleCalendar(gctx *gin.Context) {
	gctx.HTML(http.StatusOK, "work/calendar.gohtml", gin.H{})
}
