package middleware

import (
	"sfxserver/application/services"
	"sfxserver/application/services/db"
	"sfxserver/application/services/email"
	"sfxserver/application/services/templs"
)

type ServerMiddleware struct {
	DB          *db.DBService
	SqlxService *db.SqlxService
	Mail        *email.Service
	Templs      *templs.Service
	AwsS3       *services.AwsS3Service
}
