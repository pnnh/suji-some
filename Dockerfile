FROM ubuntu:21.10

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

RUN apt-get update
RUN apt-get install -y gnupg2
RUN apt-get install -y ca-certificates
RUN apt-get install -y build-essential
RUN apt-get install -y golang-go
RUN apt-get install -y nodejs npm

ADD . /home

WORKDIR /home

RUN go version
RUN node --version
RUN npm --version

RUN cd /home \
	&& pwd \
	&& ls -l \
	&& make