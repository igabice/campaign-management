# Build stage
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run db:generate && npm run build

# Production stage
FROM node:20-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy Prisma client from builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose port 3001 to the outside world
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]