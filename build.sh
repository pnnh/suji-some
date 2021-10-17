# 以下构建命令假设是在全新的ubuntu:21.10容器内执行
echo Build started on `date`
echo Asia/Shanghai > /etc/timezone
apt-get update \
    && apt-get install -y tzdata \
    && apt-get install -y gnupg2 \
    && apt-get install -y ca-certificates \
    && apt-get install -y build-essential \
    && apt-get install -y golang-go \
    && apt-get install -y nodejs npm \
    && go version \
    && node --version \
    && npm --version \
    && make