package templs

import (
	"html/template"
	"strings"

	"sfxserver/server/utils"
)

const templatesDir string = "web/templates"

type Service struct {
	bootstrap *template.Template
}

func NewService() *Service {
	serv := &Service{}

	return serv
}

func (s *Service) Init() error {
	funcMap := utils.FuncMap()
	bootstrap, err := template.New("templates").Funcs(funcMap).ParseGlob(templatesDir + "/**/*.gohtml")
	if err != nil {
		return err
	}
	s.bootstrap = bootstrap
	return nil
}

func (s *Service) Start() error {
	return nil
}

func (s *Service) Execute(name string, data map[string]interface{}) (string, error) {
	buf := &strings.Builder{}
	if err := s.bootstrap.ExecuteTemplate(buf, name, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}