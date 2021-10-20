package models

import (
	"strings"

	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/server/utils"
)

type ArticleView struct {
	dbmodels.ArticleTable
	CreateTimeFormatted string
	UpdateTimeFormatted string
	KeywordsArray []string
}

func ParseArticleView(table *dbmodels.ArticleTable) *ArticleView {
	return &ArticleView{
		ArticleTable: *table,
		CreateTimeFormatted: utils.FmtTime(table.CreateTime),
		UpdateTimeFormatted: utils.FmtTime(table.UpdateTime),
		KeywordsArray: strings.Split(table.Keywords, ","),
	}
}

type QueryResult struct {
	Articles []map[string]interface{} `json:"articles,omitempty"`
}
