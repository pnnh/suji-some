package models

import (
	"database/sql"
	"time"
)

type AccountTable struct {
	Pk          string         `json:"pk" gorm:"primaryKey"`      // 主键标识
	UName       string         `json:"uname" gorm:"column:uname"` // 账号
	UPass       string         `json:"upass" gorm:"column:upass"` // 密码
	CreateTime  time.Time      `json:"create_time" db:"create_time" gorm:"column:create_time"`
	UpdateTime  time.Time      `json:"update_time" db:"update_time" gorm:"column:update_time"`
	Image       string         `json:"image" gorm:"column:image"`
	NickName    string         `json:"nickname" db:"nickname" gorm:"column:nickname"` // 昵称
	Photo       sql.NullString `json:"photo" gorm:"column:photo"`                     // 照片
	Description sql.NullString `json:"description" gorm:"column:description"`         // 个人描述
}

func (AccountTable) TableName() string {
	return "accounts"
}
