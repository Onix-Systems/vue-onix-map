FROM nginx

LABEL maintainer="devops@onix-systems.com"

RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn && \
    mkdir -p /app && \
    sed -i "s,/usr/share/nginx/html,/app/dist," /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY ./ ./

RUN yarn install

RUN yarn build
