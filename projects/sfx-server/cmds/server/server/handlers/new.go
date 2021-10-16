package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"sfxserver/server/utils"

	"github.com/gin-gonic/gin"

	"sfxserver/server/storesvc"
)

func HandleNew(gctx *gin.Context) {
	log.Println("创建文章")

	gctx.HTML(http.StatusOK, "new.gohtml", gin.H{})
}

func HandleCreate(gctx *gin.Context) {
	reqData, err := ioutil.ReadAll(gctx.Request.Body)
	if err != nil {
		gctx.JSON(http.StatusOK, gin.H{
			"msg": "读取请求body出错",
		})
		return
	}
	log.Println("读取到body", string(reqData))
	artMap := make(map[string]interface{})
	if err = json.Unmarshal(reqData, &artMap); err != nil {
		gctx.JSON(http.StatusOK, gin.H{
			"msg": "反序列化body出错",
		})
		return
	}
	if value, ok := artMap["tt"]; !ok || value == nil {
		gctx.JSON(http.StatusOK, gin.H{
			"msg": "标题不可为空",
		})
		return
	}
	if title, ok := artMap["ct"]; !ok || title == nil {
		gctx.JSON(http.StatusOK, gin.H{
			"msg": "内容不可为空",
		})
		return
	}
	email := fmt.Sprintf("%v", artMap["em"])
	if email == "" {
		gctx.JSON(http.StatusOK, gin.H{
			"msg": "作者邮箱不可为空",
		})
		return
	}

	uk, pk := utils.CalcPostId(), utils.CalcUserID(email)
	artMap["uk"] = uk
	artMap["pk"] = pk
	artMap["at"] = time.Now().UnixNano()
	log.Println("create", artMap)

	if err := storesvc.PutArticle(gctx, artMap); err != nil {
		gctx.JSON(http.StatusOK, gin.H{
			"msg": "保存文章出错",
		})
		return
	}
	enUk, enPk := utils.EncodeId(uk), utils.EncodeId(pk)
	showUrl := fmt.Sprintf("/show/%s/%s", enUk, enPk)
	gctx.JSON(http.StatusOK, gin.H{
		"show": showUrl,
		"msg":  "OK",
	})
}
