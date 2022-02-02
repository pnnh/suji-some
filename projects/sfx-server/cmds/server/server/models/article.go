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
	Views               int64
}

type QueryResult struct {
	Articles []map[string]interface{} `json:"articles,omitempty"`
}
