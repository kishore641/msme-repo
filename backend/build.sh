#!/usr/bin/env bash
# Exit on error
set -o errexit

# Build Frontend
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Build Backend
echo "Building Backend..."
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input
