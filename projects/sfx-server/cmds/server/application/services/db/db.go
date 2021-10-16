package db

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DBService struct {
	*gorm.DB
	dsn string
}

func NewDBService(dsn string) *DBService {
	serv := &DBService{dsn: dsn}
	return serv
}

func (s *DBService) Init() error {
	dsn := s.dsn
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("数据库打开出错:%w", err)
	}
	s.DB = db
	return nil
}

func (s *DBService) Start() error {
	return nil
}
