all : make_server

DIR := $(CURDIR)

build_server :
	cd projects/sfx-server && make

make_dist :
	-mkdir dist && mkdir dist/server

make_server : make_dist build_server
	-cp -r projects/sfx-server/build dist/server \
		&& cp projects/sfx-server/Dockerfile dist/server

clean :
	-rm -f ./dist