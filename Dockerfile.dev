FROM node:20.13.1-alpine

WORKDIR /usr/src/app

RUN npm i -g @angular/cli@17.3.7
COPY package.json package-lock.json .
RUN npm install
COPY . .
EXPOSE 4200
