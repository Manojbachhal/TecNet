#!/bin/bash

# === CONFIGURATION ===
USER="ubuntu"
HOST="123.45.67.89"
REMOTE_DIR="/var/www/tecnet"

# === BUILD LOCALLY ===
echo "📦 Building React app..."
npm run build || { echo "❌ Build failed"; exit 1; }

echo "🚀 Deploying to $USER@$HOST..."

# Ensure remote directory exists
ssh $USER@$HOST "mkdir -p $REMOTE_DIR && rm -rf $REMOTE_DIR/build"

# Upload build folder via SCP
scp -r ./build "$USER@$HOST:$REMOTE_DIR"

# Optionally restart Nginx or other services
# ssh $USER@$HOST "sudo systemctl restart nginx"

echo "✅ Deployment complete!"
