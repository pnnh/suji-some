package models

type PostView struct {
	Pk              string `json:"pk"`
	Body            string `json:"body"`
	Creator         string `json:"creator"`
	CreatorNickname string `json:"creator_nickname"`
	CreateTime      string `json:"create_time"`
	UpdateTime      string `json:"update_time"`
}

type PostQueryResult struct {
	Posts []map[string]interface{} `json:"posts,omitempty"`
}
