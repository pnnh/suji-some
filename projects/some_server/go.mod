module sujiserv

go 1.13

require (
	github.com/aws/aws-sdk-go-v2/config v1.1.1
	github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue v1.0.2
	github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression v1.0.2
	github.com/aws/aws-sdk-go-v2/service/dynamodb v1.1.1
	github.com/bwmarrin/snowflake v0.3.0
	github.com/gin-gonic/gin v1.6.3
	github.com/golang-jwt/jwt v3.2.1+incompatible
	github.com/google/uuid v1.2.0
	github.com/gorilla/csrf v1.7.0
	github.com/jackc/pgproto3/v2 v2.0.7 // indirect
	github.com/json-iterator/go v1.1.9
	github.com/pquerna/otp v1.3.0
	github.com/sirupsen/logrus v1.8.1
	github.com/tdewolff/minify/v2 v2.9.17
	golang.org/x/crypto v0.0.0-20210513164829-c07d793c2f9a // indirect
	golang.org/x/text v0.3.6 // indirect
	golang.org/x/time v0.0.0-20191024005414-555d28b269f0
	gopkg.in/alexcesaro/quotedprintable.v3 v3.0.0-20150716171945-2caba252f4dc // indirect
	gopkg.in/gomail.v2 v2.0.0-20160411212932-81ebce5c23df
	gorm.io/driver/postgres v1.1.0
	gorm.io/gorm v1.21.10
)
