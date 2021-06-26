package models

import "time"

type AccountTable struct {
	Pk         string    `json:"pk" gorm:"primaryKey"`
	UName      string    `json:"uname" gorm:"column:uname"`
	UPass      string    `json:"upass" gorm:"column:upass"`
	CreateTime time.Time `json:"create_time" gorm:"column:create_time"`
	UpdateTime time.Time `json:"update_time" gorm:"column:update_time"`
	Image      string    `json:"image" gorm:"column:image"`
}

func (AccountTable) TableName() string {
	return "accounts"
}
