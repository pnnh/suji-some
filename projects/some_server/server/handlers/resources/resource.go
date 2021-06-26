package resources

import (
	"github.com/gin-gonic/gin"
)

type IResource interface {
	RegisterRouter(router *gin.Engine, name string)
}
