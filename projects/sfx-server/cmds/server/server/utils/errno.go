package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func ResponseData(gctx *gin.Context, code int, args interface{}) {
	gctx.JSON(code, args)
	return
}

func ResponseServerError(gctx *gin.Context, msg string, err error) {
	if err != nil {
		logrus.Errorln("响应出错", gctx.FullPath(), msg, err)
	}
	gctx.JSON(http.StatusInternalServerError, gin.H{"msg": msg})
	return
}

func ResponseError(gctx *gin.Context, code int, err error) {
	logrus.Errorln("响应出错", gctx.FullPath(), code, err)
	gctx.JSON(code, gin.H{"msg": "未知错误"})
	return
}

func ResponseMessage(gctx *gin.Context, code int, msg string) {
	if code != http.StatusOK && len(msg) > 0 {
		logrus.Infoln("响应消息", gctx.FullPath(), code, msg)
	}
	gctx.JSON(code, gin.H{"msg": msg})
	return
}

func ResponseErrorWithData(gctx *gin.Context, code int, msg string, err error, args interface{}) {
	logrus.Errorln("响应出错", gctx.FullPath(), code, err)
	gctx.JSON(code, gin.H{"msg": msg, "data": args})
	return
}

func ResponseMessageWithError(gctx *gin.Context, code int, msg string, err error) {
	logrus.Errorln("ResponseMessageWithError", gctx.FullPath(), code, msg, err)
	gctx.JSON(code, gin.H{"msg": msg})
	return
}
