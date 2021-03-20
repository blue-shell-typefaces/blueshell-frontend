FROM node:15.12-alpine

RUN npm install -g http-server

WORKDIR .

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist", "-P", "http://localhost:8080?" ]

