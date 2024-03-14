#STAGE 1
FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build:client

#STAGE 2
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/apps/client /usr/share/nginx/html
