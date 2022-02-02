package models

import (
	"database/sql"
	"time"
)

type PostTable struct {
	Pk         string    `json:"pk"`
	Body       string    `json:"body"`
	CreateTime time.Time `json:"create_time" db:"create_time" db:"create_time"`
	UpdateTime time.Time `json:"update_time" db:"update_time" db:"update_time"`
	Creator    string    `json:"creator"`
}

// 动态列表
type PostTableList struct {
	PostTable
	NickName sql.NullString `json:"nickname" db:"nickname"`
}

func (PostTable) TableName() string {
	return "posts"
}
