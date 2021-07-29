package resources

import (
	"fmt"
	"html"
	"html/template"
	"log"
	"net/http"
	"time"

	"gorm.io/gorm"
	dbmodels "sujiserv/application/services/db/models"
	"sujiserv/server/middleware"
	"sujiserv/server/utils"

	"github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"

)

type articleHandler struct {
	middleware *middleware.ServerMiddleware
}

// 新建文章页面
func (s *articleHandler) New(gctx *gin.Context) {
	//gctx.HTML(http.StatusOK, "index/client.html", gin.H{
	//	"title": "写文章",
	//	"data": gin.H{
	//		"csrf": csrf.Token(gctx.Request),
	//	},
	//})
	utils.ClientPage(gctx, http.StatusOK,nil)
}

// 编辑文章页面
func (s *articleHandler) Edit(gctx *gin.Context) {
	pk := gctx.Param("pk")

	article := &dbmodels.ArticleTable{
		Pk: pk,
	}
	if err := s.middleware.DB.First(article).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ClientPage(gctx, http.StatusOK, nil)
			return
		}
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	auth := s.middleware.Auth.GetAuth(gctx)
	if article.Creator != auth.UName {
		utils.ClientPage(gctx, http.StatusUnauthorized,nil)
		return
	}
	value := make(map[string]interface{})
	if err := json.Unmarshal([]byte(article.Body), &value); err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	utils.ClientPage(gctx, http.StatusOK, gin.H{
		"title": article.Title,
		"body": value,
	})
}

func json2html(value interface{}) (string, string) {
	outVal := ""
	switch real := value.(type) {
	case map[string]interface{}:
		for k, v := range real {
			subType, subValue := json2html(v)
			htag := fmt.Sprintf("<div data-name=\"%s\" data-type=\"%s\">%s</div>",
				k, subType, subValue)
			outVal += htag
		}
		return "object", outVal
	case []interface{}:
		for k, v := range real {
			subType, subValue := json2html(v)
			htag := fmt.Sprintf("<div data-name=\"%d\" data-type=\"%s\">%s</div>",
				k, subType, subValue)
			outVal += htag
		}
		return "array", outVal
	default:
		return "string", html.EscapeString(fmt.Sprintf("%v", value))
	}
}

var json = jsoniter.ConfigCompatibleWithStandardLibrary

// 查看文章
func (s *articleHandler) Read(gctx *gin.Context) {
	pk := gctx.Param("pk")
	logrus.Debug("Article ", pk)

	article := &dbmodels.ArticleTable{
		Pk: pk,
	}
	if err := s.middleware.DB.First(article).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ClientPage(gctx, http.StatusUnauthorized,nil)
			return
		}
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	value := make(map[string]interface{})
	if err := json.Unmarshal([]byte(article.Body), &value); err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	content, err := buildBody(value)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	auth := s.middleware.Auth.GetAuth(gctx)
	gctx.HTML(http.StatusOK, "article/article.html", gin.H{
		"title": article.Title,
		"body":  template.HTML(content),
		"data": map[string]interface{} {
			"pk": article.Pk,
			"creator": auth.UName == article.Creator,
			"login": auth != nil && len(auth.UName) > 0,
		},
	})
}

// 创建文章
func (s *articleHandler) Post(gctx *gin.Context) {
	log.Println("创建文章")
	in, err := parseArticlePutIn(gctx)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	auth := s.middleware.Auth.GetAuth(gctx)
	article := &dbmodels.ArticleTable{
		Pk:         utils.NewPostId(),
		Title:      in.Title,
		Body:       in.Body,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Creator:    auth.UName,
	}
	if err := s.middleware.DB.Create(article).Error; err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": article.Pk,
	})
}

type articlePutIn struct {
	Title string `json:"title"`
	Body  string `json:"body"`
}

func parseArticlePutIn(gctx *gin.Context) (*articlePutIn, error) {
	in := &articlePutIn{}
	if err := gctx.ShouldBindJSON(in); err != nil {
		return nil, err
	}
	if len(in.Title) < 1 {
		return nil, fmt.Errorf("标题不可为空")
	}
	if len(in.Body) < 1 {
		return nil, fmt.Errorf("正文不可为空")
	}
	return in, nil
}

// 修改文章
func (s *articleHandler) Put(gctx *gin.Context) {
	log.Println("修改文章")
	pk := gctx.Param("pk")
	logrus.Debug("Article Put", pk)
	in, err := parseArticlePutIn(gctx)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	if len(pk) < 1 {
		utils.ResponseError(gctx, http.StatusInternalServerError,
			fmt.Errorf("文章PK不可为空"))
		return
	}
	article := &dbmodels.ArticleTable{
		Pk: pk,
	}
	if err := s.middleware.DB.First(article).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.ResponseError(gctx, http.StatusNotFound,
				fmt.Errorf("文章不存在"))
			return
		}
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	auth := s.middleware.Auth.GetAuth(gctx)
	if article.Creator != auth.UName {
		utils.ResponseError(gctx, http.StatusUnauthorized, fmt.Errorf("无权限修改"))
		return
	}
	updateQuery := &dbmodels.ArticleTable{Pk: pk}
	updateBody := &dbmodels.ArticleTable{
		Title:      in.Title,
		Body:       in.Body,
		UpdateTime: time.Now(),
	}
	if err := s.middleware.DB.Where(updateQuery).Updates(updateBody).Error; err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": article.Pk,
	})
}

// 删除文章
func (s *articleHandler) Delete(gctx *gin.Context) {

}

func (s *articleHandler) RegisterRouter(router *gin.Engine, _ string) {
	router.GET("/article/read/:pk", s.Read) // 查看不需要授权
	group := router.Group("article")
	group.Use(s.middleware.Auth.NeedLogin)
	{
		group.GET("/new", s.New)
		group.POST("/new", s.Post)
		group.GET("/edit/:pk", s.Edit)
		group.PUT("/edit/:pk", s.Put)
		group.DELETE("/delete/:pk", s.Delete)
	}
}

func NewArticleResource(middleware *middleware.ServerMiddleware) IResource {
	return &articleHandler{
		middleware: middleware,
	}
}
