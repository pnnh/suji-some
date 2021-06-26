package utils

import (
	"time"
)

func FmtTimeUnix(unix int64) string {
	t := time.Unix(unix, 0)
	return t.Format("2006年01月02日 15:04")
}

func FmtTime(t time.Time) string {
	return t.Format("2006年01月02日 15:04")
}
