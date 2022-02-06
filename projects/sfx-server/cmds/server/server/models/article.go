package models

import (
	"database/sql"
	"time"
)

type ArticleTable struct {
	Pk          string         `json:"pk" gorm:"primaryKey"`
	Title       string         `json:"title"`
	Body        string         `json:"body"`
	CreateTime  time.Time      `json:"create_time" db:"create_time" gorm:"column:create_time" db:"create_time"`
	UpdateTime  time.Time      `json:"update_time" db:"update_time" gorm:"column:update_time" db:"update_time"`
	Creator     string         `json:"creator"`
	Keywords    sql.NullString `json:"keywords"`
	Description sql.NullString `json:"description"`
}

// 首页的文章列表模型
type IndexArticleList struct {
	ArticleTable
	NickName sql.NullString `json:"nickname" db:"nickname"`
	Views    sql.NullInt64  `json:"views" db:"views"`
}

func (ArticleTable) TableName() string {
	return "articles"
}

type ArticleView struct {
	Pk                  string    `json:"pk"`
	Title               string    `json:"title"`
	Body                string    `json:"body"`
	Creator             string    `json:"creator"`
	Keywords            string    `json:"keywords"`
	Description         string    `json:"description"`
	CreateTime          time.Time `json:"create_time"`
	UpdateTime          time.Time `json:"update_time"`
	CreateTimeFormatted string
	UpdateTimeFormatted string
	KeywordsArray       []string
	NickName            string
	Views               int64
}

type QueryResult struct {
	Articles []map[string]interface{} `json:"articles,omitempty"`
}
