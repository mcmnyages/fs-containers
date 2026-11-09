
FROM node:24

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

USER node

EXPOSE 3003

CMD ["npm", "run", "dev"]
