package models

import (
	"database/sql"
	"time"
)

type AccountTable struct {
	Pk          string         `json:"pk" gorm:"primaryKey"`      // 主键标识
	UName       string         `json:"uname" gorm:"column:uname"` // 账号
	UPass       string         `json:"upass" gorm:"column:upass"` // 密码
	CreateTime  time.Time      `json:"create_time" db:"create_time"`
	UpdateTime  time.Time      `json:"update_time" db:"update_time"`
	Image       string         `json:"image"`
	NickName    string         `json:"nickname" db:"nickname"` // 昵称
	Photo       sql.NullString `json:"photo"`                  // 照片
	Description sql.NullString `json:"description"`            // 个人描述
	EMail       sql.NullString `json:"email" db:"email"`       // 电子邮箱地址
	Site        sql.NullString `json:"site"`                   // 个人相关的网站链接
}

func (AccountTable) TableName() string {
	return "accounts"
}
