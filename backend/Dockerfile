FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules (better-sqlite3 needs them)
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY src ./src

# Create data directory for SQLite DB
RUN mkdir -p /app/data

EXPOSE 4000

CMD ["node", "src/index.js"]
