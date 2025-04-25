FROM node:20-slim

WORKDIR /app

# Install dependencies required for Playwright
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libwayland-client0 \
    wget \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Copy the rest of the application
COPY . .

# Set environment variables
ENV CI=true
ENV NODE_ENV=test

# Command to run tests
CMD ["npm", "run", "test:e2e"]
