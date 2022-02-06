package resources

import (
	"database/sql"
	"fmt"
	"html"
	"html/template"
	"log"
	"net/http"
	"strings"
	"time"

	redis "github.com/go-redis/redis/v8"
	"sfxserver/config"
	"sfxserver/server/middleware"
	"sfxserver/server/models"
	"sfxserver/server/utils"

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

	article := &models.ArticleTable{}
	sqlText := `select articles.* from articles where pk = $1;`
	if err := s.middleware.SqlxService.Get(article, sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "获取文章信息出错", err)
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
		"description": article.Description.String,
		"keywords":    article.Keywords.String,
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

	article := &models.ArticleTable{}
	sqlText := `select articles.* from articles where pk = $1;`
	if err := s.middleware.SqlxService.Get(article, sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "获取文章信息出错", err)
		return
	}
	value := make(map[string]interface{})
	if err := json.Unmarshal([]byte(article.Body), &value); err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	tocArray := []TocItem{TocItem{Title: article.Title, Header: 0}}
	content, err := buildBody(&tocArray, value)
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}

	auth, err := middleware.GetAuth(gctx)
	if err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错: %w", err)
		return
	}
	// 更新文章查看次数
	go s.updateViews(gctx, pk)

	creatorInfo, err := models.GetAccountModel(gctx, s.middleware.SqlxService, article.Creator)
	if err != nil {
		utils.ResponseServerError(gctx, "获取作者信息出错: %w", err)
		return
	}

	gctx.HTML(http.StatusOK, "article/article.gohtml", gin.H{
		"pk":          article.Pk,
		"title":       article.Title,
		"description": article.Description.String,
		"keywords":    article.Keywords.String,
		"keywordsList": strings.FieldsFunc(article.Keywords.String, func(c rune) bool {
			return c == ','
		}),
		"tocList": tocArray,
		"creator": gin.H{
			"pk":          creatorInfo.Pk,
			"email":       creatorInfo.EMail,
			"nickname":    creatorInfo.NickName,
			"description": creatorInfo.Description,
			"photo":       creatorInfo.Photo,
			"regtime":     utils.FmtTime(creatorInfo.CreateTime),
		},
		"body": template.HTML(content),
		"data": map[string]interface{}{
			"pk":      article.Pk,
			"creator": auth == article.Creator,
			"login":   len(auth) > 0,
		},
	})
}

// 检查是否是机器人爬虫
func isBot(userAgent string) bool {
	userAgent = strings.ToLower(userAgent)
	return strings.Contains(userAgent, "bot") ||
		strings.Contains(userAgent, "spider")
}

func (s *articleHandler) updateViews(gctx *gin.Context, pk string) {
	// todo 临时代码，先打印请求头，后续观察特征过滤来自蜘蛛的请求
	//for k, v := range gctx.Request.Header {
	//	logrus.Errorln("updateViews", k, v)
	//}
	userAgent := gctx.GetHeader("User-Agent")
	logrus.Infoln("updateViews isBot", userAgent, isBot(userAgent))
	if isBot(userAgent) {
		return
	}

	clientIp := ""
	if config.Debug() {
		clientIp = gctx.ClientIP()
	} else {
		forwardedFor := gctx.GetHeader("X-Forwarded-For")
		ipList := strings.Split(forwardedFor, ",")
		if len(ipList) < 1 {
			return
		}
		clientIp = strings.TrimSpace(ipList[0])
	}
	if len(clientIp) < 1 {
		return
	}
	key := "article_views:" + pk + ":" + clientIp
	val, err := s.middleware.Redis.Get(gctx, key).Result()
	if err != nil && err != redis.Nil {
		logrus.Errorln("updateViews获取值出错", err)
	}
	if len(val) > 0 {
		return
	}
	expire := time.Hour * 240
	_, err = s.middleware.Redis.SetNX(gctx, key, "1", expire).Result()
	if err != nil {
		logrus.Errorln("updateViews出错", err)
	}

	sqlCountText := `insert into articles_views(pk, views)
values($1, 1) on conflict(pk) do update set views = articles_views.views + 1;`

	if _, err = s.middleware.SqlxService.ExecContext(gctx, sqlCountText, pk); err != nil {
		utils.ResponseServerError(gctx, "更新查看次数出错", err)
		return
	}
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

	articlePk := utils.NewPostId()
	sqlText := `insert into articles(pk, title, body, create_time, update_time, creator, keywords, description)
values(:pk, :title, :body, :create_time, :update_time, :creator, :keywords, :description);`
	_, err = s.middleware.SqlxService.NamedExec(sqlText,
		map[string]interface{}{
			"pk":          articlePk,
			"title":       in.Title,
			"body":        in.Body,
			"create_time": time.Now().UTC(),
			"update_time": time.Now().UTC(),
			"creator":     auth,
			"keywords":    sql.NullString{String: in.Keywords, Valid: true},
			"description": sql.NullString{String: in.Description, Valid: true},
		})
	if err != nil {
		utils.ResponseError(gctx, http.StatusInternalServerError, err)
		return
	}
	utils.ResponseData(gctx, http.StatusOK, gin.H{
		"pk": articlePk,
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
	article := &models.ArticleTable{}
	sqlText := `select articles.* from articles where pk = $1;`
	if err := s.middleware.SqlxService.Get(article, sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "获取文章信息出错", err)
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
	sqlText = `update articles set title=:title, body=:body, keywords=:keywords, 
description=:description, update_time=:update_time where pk = :pk;`
	sqlParams := map[string]interface{}{
		"pk":          pk,
		"title":       in.Title,
		"body":        in.Body,
		"keywords":    sql.NullString{String: in.Keywords, Valid: true},
		"description": sql.NullString{String: in.Description, Valid: true},
		"update_time": time.Now().UTC(),
	}
	_, err = s.middleware.SqlxService.NamedExec(sqlText, sqlParams)
	if err != nil {
		utils.ResponseServerError(gctx, "更新文章内容出错: %w", err)
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
	article := &models.ArticleTable{}
	sqlText := `select articles.* from articles where pk = $1;`
	if err := s.middleware.SqlxService.Get(article, sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "获取用户信息出错", err)
		return
	}
	if article.Creator != user {
		utils.ResponseError(gctx, http.StatusUnauthorized, fmt.Errorf("无权限修改"))
		return
	}
	sqlText = `delete from articles where pk = $1;`
	if _, err := s.middleware.SqlxService.Exec(sqlText, pk); err != nil {
		utils.ResponseServerError(gctx, "删除文章出错", err)
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
