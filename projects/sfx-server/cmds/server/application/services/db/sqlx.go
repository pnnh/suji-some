package db

import (
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type SqlxService struct {
	*sqlx.DB
	dsn string
}

func NewSqlxService(dsn string) *SqlxService {
	serv := &SqlxService{dsn: dsn}
	return serv
}

func (s *SqlxService) Init() error {
	db, err := sqlx.Connect("postgres", s.dsn)
	if err != nil {
		log.Fatalln(err)
	}
	s.DB = db
	return nil
}

func (s *SqlxService) Start() error {
	return nil
}
