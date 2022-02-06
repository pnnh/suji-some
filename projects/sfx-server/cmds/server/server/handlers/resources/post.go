package resources

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"sfxserver/server/middleware"
	"sfxserver/server/models"
	"sfxserver/server/utils"

	"github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

const IndexPageSize = 10

type postHandler struct {
	middleware *middleware.ServerMiddleware
}

// 创建文章
func (s *postHandler) Create(gctx *gin.Context) {
	log.Println("创建动态")
	postBody := gctx.PostForm("body")
	if len(postBody) < 1 {
		utils.ResponseMessage(gctx, http.StatusBadRequest, "参数有误")
		return
	}
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}

	articlePk := utils.NewPostId()
	sqlText := `insert into posts(pk, body, create_time, update_time, creator)
values(:pk, :body, :create_time, :update_time, :creator);`
	_, err = s.middleware.SqlxService.NamedExec(sqlText,
		map[string]interface{}{
			"pk":          articlePk,
			"body":        postBody,
			"create_time": time.Now().UTC(),
			"update_time": time.Now().UTC(),
			"creator":     auth,
		})
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": articlePk,
	})
}

// 删除文章
func (s *postHandler) Delete(gctx *gin.Context) {
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
	pk := gctx.Param("pk")
	logrus.Debug("Article Put", pk)
	if len(pk) < 1 {
		utils.ResponseError(gctx, http.StatusInternalServerError,
			fmt.Errorf("动态PK不可为空"))
		return
	}
	article := &models.PostTable{}
	sqlText := `select posts.* from posts where pk = $1;`
	if err := s.middleware.SqlxService.Get(article, sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错", err)
		return
	}
	if article.Creator != user {
		utils.ResponseError(gctx, http.StatusUnauthorized, fmt.Errorf("无权限修改"))
		return
	}
	sqlText = `delete from posts where pk = $1;`
	if _, err := s.middleware.SqlxService.Exec(sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "删除动态出错", err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": article.Pk,
	})
}

func (s *postHandler) List(gctx *gin.Context) {
	pageString, ok := gctx.GetQuery("p")
	currentPage := 1
	if ok {
		if v, err := strconv.Atoi(pageString); err != nil || v <= 0 {
			utils.ResponseError(gctx, http.StatusInternalServerError, errors.New("参数有误"))
			return
		} else {
			currentPage = v
		}
	}
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错", err)
		return
	}
	sqlCountText := `select count(*) from posts;`
	var listCount int
	if err := s.middleware.SqlxService.QueryRow(sqlCountText).Scan(&listCount); err != nil {
		utils.ResponseServerError(gctx, "查询文章总数出错", err)
		return
	}
	maxPage := listCount / IndexPageSize
	if listCount%IndexPageSize != 0 {
		maxPage += 1
	}
	if currentPage > maxPage {
		currentPage = maxPage
	}
	sqlText := `select posts.*, accounts.nickname
from posts 
    left join accounts on posts.creator = accounts.pk
order by create_time desc offset $1 limit $2;`
	var sqlResults []models.PostTableList

	offset, limit := (currentPage-1)*IndexPageSize, IndexPageSize
	if err := s.middleware.SqlxService.Select(&sqlResults, sqlText, offset, limit); err != nil {
		utils.ResponseServerError(gctx, "查询文章列表出错", err)
		return
	}
	list := make([]*models.PostView, len(sqlResults))
	for k, v := range sqlResults {
		list[k] = &models.PostView{
			Pk:              v.Pk,
			Body:            v.Body,
			Creator:         v.Creator,
			UpdateTime:      v.UpdateTime.Format(time.RFC3339),
			CreateTime:      v.CreateTime.Format(time.RFC3339),
			CreatorNickname: v.NickName.String,
		}
	}

	gctx.HTML(http.StatusOK, "post/list.gohtml", gin.H{
		"data": gin.H{
			"login":       len(auth) > 0,
			"list":        list,
			"count":       listCount,
			"maxPage":     maxPage,
			"currentPage": currentPage,
		},
	})
}

func (s *postHandler) Select(gctx *gin.Context) {
	pageString := gctx.PostForm("p")
	currentPage := 1
	if v, err := strconv.Atoi(pageString); err != nil || v <= 0 {
		utils.ResponseError(gctx, http.StatusInternalServerError, errors.New("参数有误"))
		return
	} else {
		currentPage = v
	}
	sqlCountText := `select count(*) from posts;`
	var listCount int
	if err := s.middleware.SqlxService.QueryRow(sqlCountText).Scan(&listCount); err != nil {
		utils.ResponseServerError(gctx, "查询文章总数出错", err)
		return
	}
	maxPage := listCount / IndexPageSize
	if listCount%IndexPageSize != 0 {
		maxPage += 1
	}
	if currentPage > maxPage {
		currentPage = maxPage
	}
	sqlText := `select posts.*, accounts.nickname
from posts 
    left join accounts on posts.creator = accounts.pk
order by create_time desc offset $1 limit $2;`
	var sqlResults []models.PostTableList

	offset, limit := (currentPage-1)*IndexPageSize, IndexPageSize
	if err := s.middleware.SqlxService.Select(&sqlResults, sqlText, offset, limit); err != nil {
		utils.ResponseServerError(gctx, "查询文章列表出错", err)
		return
	}
	list := make([]*models.PostView, len(sqlResults))
	for k, v := range sqlResults {
		list[k] = &models.PostView{
			Pk:              v.Pk,
			Body:            v.Body,
			Creator:         v.Creator,
			UpdateTime:      v.UpdateTime.Format(time.RFC3339),
			CreateTime:      v.CreateTime.Format(time.RFC3339),
			CreatorNickname: v.NickName.String,
		}
	}

	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"list":    list,
		"count":   listCount,
		"maxPage": maxPage,
	})
}

func (s *postHandler) RegisterRouter(router *gin.Engine, _ string) {
	router.GET("/post", s.List)
	router.POST("/post", s.Select)
	router.POST("/post/new", s.Create)
	router.DELETE("/post/delete/:pk", s.Delete)
}

func NewPostResource(middleware *middleware.ServerMiddleware) IResource {
	return &postHandler{
		middleware: middleware,
	}
}
