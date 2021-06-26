all : build upx move

build :
	GOOS=linux GOARCH=arm64 go build -o dist/bin/sujiserv_arm64

upx :
	cd dist/bin && upx sujiserv_arm64

move :
	-cp -r web dist

clean :
	-rm -f ./dist