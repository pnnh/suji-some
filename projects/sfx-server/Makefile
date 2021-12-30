all : build_server build_proxy copy_web

DIR := $(CURDIR)

setup :
	echo "package gen\nvar RunVersion = \"`openssl rand -base64 3 | md5sum | cut -c1-8`\"" \
		> $(DIR)/cmds/server/gen/gen.go

build_server : setup
	cd cmds/server \
		&& GOOS=linux go build -o ../../build/sfxserver

build_proxy :
	cd cmds/proxy \
		&& GOOS=linux go build -o ../../build/sfxproxy

copy_web :
	-cd $(DIR) && cp -r cmds/server/web build

clean :
	-rm -f ./dist