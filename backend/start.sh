#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database is ready"

# Run Prisma migrations
echo "Running Prisma db push..."
npx prisma db push --accept-data-loss

# Start the application
echo "Starting application..."
exec npm start