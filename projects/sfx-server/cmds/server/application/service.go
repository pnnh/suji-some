package application

type IService interface {
	Init() error
	Start() error
}
