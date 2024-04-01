FROM node:20.10.0-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV DB_URL default

COPY . .
CMD node dist/apps/terralink-demo-api/main.js DB_URL=${DB_URL}
