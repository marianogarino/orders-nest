# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
EXPOSE 3000
CMD ["npm","run","start:dev"]