all : gen_assets

DIR := $(CURDIR)

build_server :
	cd projects/sfx-server && make

make_dist :
	-mkdir dist && mkdir dist/server && mkdir dist/web

make_server : make_dist build_server
	-cp -r projects/sfx-server/build dist/server

build_web :
	cd projects/sfx-web && make

make_web : make_dist build_web
	-cp -r projects/sfx-web/build dist/web

gen_assets : make_web make_server
	-grep \.js dist/web/build/index.html > dist/server/build/web/gen/js.html \
		&& grep \.css dist/web/build/index.html > dist/server/build/web/gen/css.html

clean :
	-rm -f ./dist