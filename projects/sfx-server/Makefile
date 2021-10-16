all : build_server build_proxy copy_web

DIR := $(CURDIR)

build_server :
	cd cmds/server \
		&& GOOS=linux go build -o ../../build/sfxserver

build_proxy :
	cd cmds/proxy \
		&& GOOS=linux go build -o ../../build/sfxproxy

copy_web :
	-cd $(DIR) && cp -r cmds/server/web build && cp Dockerfile build

clean :
	-rm -f ./dist