package models

import "time"

type ArticleView struct {
	Pk                  string    `json:"pk"`
	Title               string    `json:"title"`
	Body                string    `json:"body"`
	Creator             string    `json:"creator"`
	Keywords            string    `json:"keywords"`
	Description         string    `json:"description"`
	CreateTime          time.Time `json:"create_time"`
	UpdateTime          time.Time `json:"update_time"`
	CreateTimeFormatted string
	UpdateTimeFormatted string
	KeywordsArray       []string
	NickName            string
}

//func ParseArticleView(table *dbmodels.ArticleTable) *ArticleView {
//	return &ArticleView{
//		ArticleTable:        *table,
//		CreateTimeFormatted: utils.FmtTime(table.CreateTime),
//		UpdateTimeFormatted: utils.FmtTime(table.UpdateTime),
//		KeywordsArray:       strings.Split(table.Keywords.String, ","),
//	}
//}

type QueryResult struct {
	Articles []map[string]interface{} `json:"articles,omitempty"`
}
