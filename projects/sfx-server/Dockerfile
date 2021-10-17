FROM ubuntu:21.04

# 指定RUN工作目录
WORKDIR /home

# 拷贝启动脚本
COPY build /home

RUN apt-get update \
		&& apt-get install -y ca-certificates \
		&& apt-get install -y libc6 \
		&& apt-get clean \
		&& ls -a /home

# 启动程序
ENTRYPOINT ["/home/sfxproxy"]
