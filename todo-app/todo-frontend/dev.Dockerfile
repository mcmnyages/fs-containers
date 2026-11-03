
FROM node:24

WORKDIR /usr/src/app

# Copy dependency files first
COPY package*.json ./

# Install dependencies inside the container
RUN npm ci

# Copy the remaining application files
COPY . .

# Start Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
