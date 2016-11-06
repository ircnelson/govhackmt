FROM node:argon

RUN mkdir -p /usr/src/app
WORKDIR /usr/www/felipefontana/public_html/govhackmt/api

COPY package.json /usr/www/felipefontana/public_html/govhackmt
RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD [ "node", "index.js" ]