package otp

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image/png"
	"time"

	"sfxserver/config"

	"github.com/pquerna/otp/totp"
)

type RegisterOut struct {
	Image  string
	Secret string
}

func Register(account string) (*RegisterOut, error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      config.ISSUER,
		AccountName: account,
	})
	if err != nil {
		return nil, err
	}
	var buf bytes.Buffer
	img, err := key.Image(200, 200)
	if err != nil {
		return nil, err
	}
	err = png.Encode(&buf, img)
	if err != nil {
		return nil, err
	}
	out := &RegisterOut{
		Image:  base64.StdEncoding.EncodeToString(buf.Bytes()),
		Secret: key.Secret(),
	}
	return out, nil
}

func Validate(secret, passcode string) error {
	// 通过account从数据库中查询secret
	fmt.Println("Validating TOTP...")
	if len(secret) < 1 {
		return fmt.Errorf("key不存在")
	}
	valid := totp.Validate(passcode, secret)
	if valid {
		return nil
	} else {
		return fmt.Errorf("invalid passcode")
	}
}

func GenerateCode(secret string, t time.Time) (string, error) {
	return totp.GenerateCode(secret, t)
}
