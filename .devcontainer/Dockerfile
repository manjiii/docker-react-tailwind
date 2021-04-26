FROM node:15.9.0-buster-slim
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y git \ 
    && apt-get purge -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g npm@7