FROM node:alpine

EXPOSE 8080

RUN mkdir -p /app/src
WORKDIR /app

COPY src /app/src
COPY package.json /app
COPY webpack.config.js /app

COPY data /app/data

RUN npm install
RUN npm run build

CMD [ "npm", "start"]
