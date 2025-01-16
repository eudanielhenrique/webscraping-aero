FROM node:16-slim

# Instalar pacotes essenciais
RUN apt-get update && apt-get install -y \
    chromium \
    libgbm-dev \
    libnss3 \
    fonts-liberation \
    libxss1 \
    wget --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependências do Node.js
WORKDIR /app
COPY package.json .
RUN npm install

COPY . .
CMD ["npm", "start"]
