package models

import (
	dbmodels "sfxserver/application/services/db/models"
	"sfxserver/server/utils"
)

type ArticleView struct {
	dbmodels.ArticleTable
	CreateTimeFormatted string
	UpdateTimeFormatted string
}

func ParseArticleView(table *dbmodels.ArticleTable) *ArticleView {
	return &ArticleView{
		ArticleTable: *table,
		CreateTimeFormatted: utils.FmtTime(table.CreateTime),
		UpdateTimeFormatted: utils.FmtTime(table.UpdateTime),
	}
}

type QueryResult struct {
	Articles []map[string]interface{} `json:"articles,omitempty"`
}
