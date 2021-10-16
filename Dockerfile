FROM ubuntu:21.10

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Shanghai

RUN rm /var/lib/apt/lists/* -vf	\
	&& apt-get clean \
	&& apt-get update -y --allow-unauthenticated \
	&& apt-get install -y gnupg2 ca-certificates build-essential golang-go nodejs npm

ADD . /home

WORKDIR /home

RUN go version
RUN node --version
RUN npm --version

RUN cd /home \
	&& pwd \
	&& ls -l \
	&& make