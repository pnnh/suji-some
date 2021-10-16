package middleware

import (
	"sfxserver/application/services/db"
	"sfxserver/application/services/email"
	"sfxserver/application/services/templs"
)

type ServerMiddleware struct {
	DB   *db.DBService
	Mail *email.Service
	Templs *templs.Service
}
