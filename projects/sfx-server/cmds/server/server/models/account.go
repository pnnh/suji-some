package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"sfxserver/application/services/db"
	"sfxserver/server/utils"
)

type AccountTable struct {
	Pk          string         `json:"pk"`    // 主键标识
	UName       string         `json:"uname"` // 账号
	UPass       string         `json:"upass"` // 密码
	CreateTime  time.Time      `json:"create_time" db:"create_time"`
	UpdateTime  time.Time      `json:"update_time" db:"update_time"`
	Image       string         `json:"image"`                  // OTP验证码图片数据
	NickName    string         `json:"nickname" db:"nickname"` // 昵称
	Photo       sql.NullString `json:"photo"`                  // 照片
	Description sql.NullString `json:"description"`            // 个人描述
	EMail       sql.NullString `json:"email" db:"email"`       // 电子邮箱地址
	Site        sql.NullString `json:"site"`                   // 个人相关的网站链接
}

func (AccountTable) TableName() string {
	return "accounts"
}

type AccountModel struct {
	AccountTable
	Photo       string `json:"photo"`            // 照片
	Description string `json:"description"`      // 个人描述
	EMail       string `json:"email" db:"email"` // 电子邮箱地址
	Site        string `json:"site"`             // 个人相关的网站链接
}

func GetAccountModel(ctx context.Context, sqlxService *db.SqlxService, pk string) (*AccountModel, error) {
	accountTable := &AccountTable{}
	sqlText := `select accounts.* from accounts where pk = $1;`
	if err := sqlxService.Get(accountTable, sqlText, pk); err != nil {
		return nil, fmt.Errorf("获取用户信息出错: %w", err)
	}

	model := &AccountModel{
		AccountTable: *accountTable,
		Photo:        utils.GetPhotoOrDefault(accountTable.Photo.String),
		Description:  accountTable.Description.String,
		EMail:        accountTable.EMail.String,
		Site:         accountTable.Site.String,
	}

	return model, nil
}
