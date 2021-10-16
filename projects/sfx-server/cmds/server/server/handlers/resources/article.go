package resources

import (
	"fmt"
	"html"
	"html/template"
	"log"
	"net/http"
	"time"

	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/server/middleware"
	"sfxserver/server/utils"

	"gorm.io/gorm"

	"github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type articleHandler struct {
	middleware *middleware.ServerMiddleware
}

// 新建文章页面
func (s *articleHandler) New(gctx *gin.Context) {
	//gctx.HTML(http.StatusOK, "index/client.gohtml", gin.H{
	//	"title": "写文章",
	//	"data": gin.H{
	//		"csrf": csrf.Token(gctx.Request),
	//	},
	//})
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
	utils.ClientPage(gctx, http.StatusOK, nil)
}

// 编辑文章页面
func (s *articleHandler) Edit(gctx *gin.Context) {
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
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

	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}
	if article.Creator != auth {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
	value := make(map[string]interface{})
	if err := json.Unmarshal([]byte(article.Body), &value); err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	utils.ClientPage(gctx, http.StatusOK, gin.H{
		"title":       article.Title,
		"body":        value,
		"description": article.Description,
		"keywords":    article.Keywords,
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
			utils.ClientPage(gctx, http.StatusNotFound, nil)
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

	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}
	gctx.HTML(http.StatusOK, "article/article.gohtml", gin.H{
		"pk":          article.Pk,
		"title":       article.Title,
		"description": article.Description,
		"keywords":    article.Keywords,
		"body":        template.HTML(content),
		"data": map[string]interface{}{
			"pk":      article.Pk,
			"creator": auth == article.Creator,
			"login":   len(auth) > 0,
		},
	})
}

// 创建文章
func (s *articleHandler) Create(gctx *gin.Context) {
	log.Println("创建文章")
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
	in, err := parseArticlePutIn(gctx)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}
	article := &dbmodels.ArticleTable{
		Pk:          utils.NewPostId(),
		Title:       in.Title,
		Body:        in.Body,
		CreateTime:  time.Now(),
		UpdateTime:  time.Now(),
		Creator:     auth,
		Keywords:    in.Keywords,
		Description: in.Description,
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
	Title       string `json:"title"`
	Body        string `json:"body"`
	Keywords    string `json:"keywords"`
	Description string `json:"description"`
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
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
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

	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}
	if article.Creator != auth {
		utils.ResponseError(gctx, http.StatusUnauthorized, fmt.Errorf("无权限修改"))
		return
	}
	updateQuery := &dbmodels.ArticleTable{Pk: pk}
	updateBody := &dbmodels.ArticleTable{
		Title:       in.Title,
		Body:        in.Body,
		Keywords:    in.Keywords,
		Description: in.Description,
		UpdateTime:  time.Now(),
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
	user, err := middleware.GetAuth(gctx)
	if err != nil || len(user) < 1 {
		utils.ClientPage(gctx, http.StatusUnauthorized, nil)
		return
	}
	pk := gctx.Param("pk")
	logrus.Debug("Article Put", pk)
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
	if article.Creator != user {
		utils.ResponseError(gctx, http.StatusUnauthorized, fmt.Errorf("无权限修改"))
		return
	}
	query := &dbmodels.ArticleTable{Pk: pk}
	if err := s.middleware.DB.Delete(query).Error; err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": article.Pk,
	})
}

func (s *articleHandler) RegisterRouter(router *gin.Engine, _ string) {
	router.GET("/article/read/:pk", s.Read)
	router.GET("/article/new", s.New)
	router.POST("/article/new", s.Create)
	router.GET("/article/edit/:pk", s.Edit)
	router.PUT("/article/edit/:pk", s.Put)
	router.DELETE("/article/delete/:pk", s.Delete)
}

func NewArticleResource(middleware *middleware.ServerMiddleware) IResource {
	return &articleHandler{
		middleware: middleware,
	}
}