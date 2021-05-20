FROM nginx

LABEL maintainer="devops@onix-systems.com"

RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

RUN mkdir -p /app && \
    echo "server {\n\
        listen 80;\n\
        server_name localhost;\n\
        root /app/dist;\n\
        location / {\n\
            try_files \$uri /index.html /index.htm;\n\
        }\n\
    }" > /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY ./ ./

RUN yarn install

RUN yarn build
