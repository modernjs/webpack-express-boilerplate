FROM node:7.2


RUN set -x \
        && apt-key adv --fetch-keys http://dl.yarnpkg.com/debian/pubkey.gpg \
        && echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
        && apt-get update && apt-get install -y --no-install-recommends \
            git \
            yarn

VOLUME $HOME/.cache/yarn

ENV PATH $PATH:$HOME/.yarn/bin


RUN mkdir /app

WORKDIR /app

COPY package.json yarn.lock /app/

RUN set -e \
        && yarn cache clean \
        && yarn install

COPY . /app

ENV NODE_ENV production

ENV PORT 80
EXPOSE 80

RUN yarn run build

CMD ["yarn", "run", "start"]
