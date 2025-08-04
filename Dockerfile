FROM node:18-alpine

WORKDIR /app1

COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install hammerjs json-schema prop-types babel expo --legacy-peer-deps

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web"]