package models

import "time"

type ArticleTable struct {
	Pk         string    `json:"pk" gorm:"primaryKey"`
	Title      string    `json:"title"`
	Body       string    `json:"body"`
	CreateTime time.Time `json:"create_time" gorm:"column:create_time"`
	UpdateTime time.Time `json:"update_time" gorm:"column:update_time"`
	Creator    string    `json:"creator"`
	Keywords string 	`json:"keywords"`
	Description string 	`json:"description"`
}

func (ArticleTable) TableName() string {
	return "articles"
}
