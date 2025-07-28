FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm install -g serve

COPY . .
RUN npm run build

EXPOSE 80

HEALTHCHECK CMD wget --spider --quiet http://localhost:80 || exit 1

CMD [ "serve", "-s", "dist" ]
