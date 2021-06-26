package handlers

import (
	"net/http"

	"sujiserv/server/storesvc"
	"sujiserv/server/utils"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func HandleShow(gctx *gin.Context) {
	logrus.Debugln("查看文章")

	uk, pk := gctx.Param("uk"), gctx.Param("pk")
	if uk == "" || pk == "" {
		gctx.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "文章不存在"})
		return
	}
	deUk, err := utils.DecodeId(uk)
	dePk, err2 := utils.DecodeId(pk)
	//ukInt, err := strconv.ParseUint(uk, 10, 64)
	//pkInt, err2 := strconv.ParseUint(pk, 10, 64)
	if err != nil || err2 != nil {
		logrus.Infoln("转换参数出错", err, err2)
		gctx.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "文章不存在"})
		return
	}
	if deUk <= 0 || dePk <= 0 {
		gctx.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "文章不存在"})
		return
	}

	a, b := storesvc.GetArticle(gctx, deUk, dePk)

	logrus.Debugln("查看文章2", a, b)

	gctx.HTML(http.StatusOK, "show.html", a)
}
