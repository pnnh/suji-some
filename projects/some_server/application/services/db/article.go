package db

import (
	"time"

	dbmodels "sujiserv/application/services/db/models"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func PutArticle() {
	dsn := "host=localhost user=postgres password=example dbname=sujisome port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		logrus.Errorln("数据库打开出错", err)
		return
	}
	article := &dbmodels.ArticleTable{
		Pk:    uuid.New().String(),
		Title: "title", Body: "body",
		CreateTime: time.Now(),
		UpdateTime: time.Now(), Creator: "1",
	}

	if err = db.Create(article).Error; err != nil {
		logrus.Errorln("执行出错", err)
		return
	}
}
