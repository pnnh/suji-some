all : build_server copy_web

DIR := $(CURDIR)

setup :
	-mkdir $(DIR)/cmds/server/gen
	-echo "package gen\nvar RunVersion = \"`openssl rand -base64 3 | md5sum | cut -c1-8`\"" \
		> $(DIR)/cmds/server/gen/gen.go

build_server : setup
	cd cmds/server \
		&& GOOS=linux go build -o ../../build/sfxserver

copy_web :
	-cd $(DIR) && cp -r cmds/server/web build

clean :
	-rm -f ./dist