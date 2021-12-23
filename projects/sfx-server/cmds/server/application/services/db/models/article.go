package models

import (
	"database/sql"
	"time"
)

type ArticleTable struct {
	Pk          string         `json:"pk" gorm:"primaryKey"`
	Title       string         `json:"title"`
	Body        string         `json:"body"`
	CreateTime  time.Time      `json:"create_time" gorm:"column:create_time" db:"create_time"`
	UpdateTime  time.Time      `json:"update_time" gorm:"column:update_time" db:"update_time"`
	Creator     string         `json:"creator"`
	Keywords    sql.NullString `json:"keywords"`
	Description sql.NullString `json:"description"`
}

// 首页的文章列表模型
type IndexArticleList struct {
	ArticleTable
	NickName sql.NullString `json:"nickname" gorm:"column:nickname" db:"nickname"`
}

func (ArticleTable) TableName() string {
	return "articles"
}
