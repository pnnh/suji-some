all : build

DIR := $(CURDIR)

setup :
	echo "export const Version = '`openssl rand -base64 3 | md5sum | cut -c1-8`'" > $(DIR)/src/gen/version.ts

build : setup
	npm run build

clean :
	-rm -f ./dist
