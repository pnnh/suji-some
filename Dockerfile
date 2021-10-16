FROM ubuntu:20.04

COPY projects /home

RUN apt-get update \
		&& apt-get install -y ca-certificates \
		&& ls -a /home
