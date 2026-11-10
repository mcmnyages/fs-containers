# Stage 1: Build frontend
FROM node:22-alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve production build
FROM nginx:alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80