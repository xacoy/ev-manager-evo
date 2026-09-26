FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server ./
COPY index.html manifest.json ./public-assets/

EXPOSE 3000

CMD ["node", "index.js"]
