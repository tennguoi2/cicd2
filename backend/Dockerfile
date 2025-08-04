# backend/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Chỉ copy package.json và package-lock.json trong backend
COPY backend/package*.json ./

RUN npm install

# Copy toàn bộ mã nguồn backend
COPY backend/ .

EXPOSE 3333

CMD ["npm","start"]
