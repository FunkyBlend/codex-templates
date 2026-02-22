#!/usr/bin/env bash
# deploy-codex.sh — Deploy Codex Marketplace to Singapore server
# Usage: bash deploy/deploy-codex.sh
# Requires: ssh key for flashadmin@159.65.246.230 in your SSH agent

set -euo pipefail

JUMP_HOST="flashadmin@159.65.246.230"
TARGET_HOST="flashadmin@167.71.205.41"
REMOTE_DIR="/opt/codex-marketplace"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> [1/5] Syncing project files to Singapore server..."
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'deploy' \
  --exclude '*.log' \
  -e "ssh -J ${JUMP_HOST}" \
  "${LOCAL_DIR}/" \
  "${TARGET_HOST}:${REMOTE_DIR}/"

echo "==> [2/5] Uploading .env.production..."
# Copy the production env file (you must create deploy/.env.production locally first)
if [ -f "${LOCAL_DIR}/deploy/.env.production" ]; then
  scp -o "ProxyJump=${JUMP_HOST}" \
    "${LOCAL_DIR}/deploy/.env.production" \
    "${TARGET_HOST}:${REMOTE_DIR}/.env"
else
  echo "    WARNING: deploy/.env.production not found — skipping .env upload."
  echo "    The app will run without a database (static mock data only)."
fi

echo "==> [3/5] Installing dependencies and building..."
ssh -J "${JUMP_HOST}" "${TARGET_HOST}" bash <<'REMOTE'
set -euo pipefail
cd /opt/codex-marketplace

# Install Node 20 if missing
if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* ]]; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# Install PM2 if missing
if ! command -v pm2 &>/dev/null; then
  echo "Installing PM2..."
  sudo npm install -g pm2
fi

# Install dependencies
npm ci --omit=dev

# Build Next.js
npm run build
REMOTE

echo "==> [4/5] Starting / restarting app with PM2..."
ssh -J "${JUMP_HOST}" "${TARGET_HOST}" bash <<'REMOTE'
set -euo pipefail
cd /opt/codex-marketplace

if pm2 list | grep -q "codex-marketplace"; then
  pm2 restart codex-marketplace
else
  pm2 start ecosystem.config.js
  pm2 save
  # Enable PM2 startup on boot (run the printed command manually if needed)
  pm2 startup systemd -u flashadmin --hp /home/flashadmin || true
fi
REMOTE

echo "==> [5/5] Installing Nginx config..."
ssh -J "${JUMP_HOST}" "${TARGET_HOST}" bash <<'REMOTE'
set -euo pipefail

# Install Nginx if missing
if ! command -v nginx &>/dev/null; then
  sudo apt-get update && sudo apt-get install -y nginx
fi

# Deploy config
sudo cp /opt/codex-marketplace/deploy/nginx-codex.conf /etc/nginx/sites-available/codex-marketplace
sudo ln -sf /etc/nginx/sites-available/codex-marketplace /etc/nginx/sites-enabled/codex-marketplace

# Remove default site if it exists (avoids port 80 conflict)
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
REMOTE

echo ""
echo "✅ Deployment complete!"
echo "   Site should be live at: http://167.71.205.41"
echo ""
echo "   Verify with:"
echo "   curl -s -o /dev/null -w '%{http_code}' http://167.71.205.41"
