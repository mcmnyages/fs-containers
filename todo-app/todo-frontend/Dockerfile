
FROM node:22 AS dependencies

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci


# Testing stage
FROM dependencies AS test-stage

COPY . .

RUN npm test


# Build stage
FROM dependencies AS build-stage

COPY . .

COPY --from=test-stage /usr/src/app/package.json /tmp/test-passed

ENV VITE_BACKEND_URL=http://localhost:3000

RUN npm run build


# Production stage
FROM nginx:alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
