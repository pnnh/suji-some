package middleware

import (
	"sujiserv/application/services/db"
	"sujiserv/application/services/email"
	"sujiserv/application/services/templs"
)

type ServerMiddleware struct {
	DB   *db.DBService
	Auth *authMiddleware
	Mail *email.Service
	Templs *templs.Service
}
