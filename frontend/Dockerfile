FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --no-cache
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

FROM node:22-alpine
RUN npm install -g serve --no-cache && npm cache clean --force
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
HEALTHCHECK CMD wget --spider --quiet http://localhost:3000 || exit 1
CMD ["serve", "-s", "dist"]