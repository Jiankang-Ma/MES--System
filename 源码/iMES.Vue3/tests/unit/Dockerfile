FROM node:14-bullseye

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "run", "test:unit"]
