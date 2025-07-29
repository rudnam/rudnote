FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install
RUN npm install -g serve

COPY . .
RUN npm run build

EXPOSE 3000

HEALTHCHECK CMD wget --spider --quiet http://localhost:3000 || exit 1

CMD ["serve", "-s", "dist"]
