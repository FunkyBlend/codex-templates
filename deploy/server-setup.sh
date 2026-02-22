#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/codex-marketplace"
cd "$APP_DIR"

echo "===== [1/5] Node.js check ====="
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1)" != "v20" ]]; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js already installed: $(node -v)"
fi

echo "===== [2/5] PM2 check ====="
if ! command -v pm2 &>/dev/null; then
  echo "Installing PM2..."
  sudo npm install -g pm2
else
  echo "PM2 already installed: $(pm2 --version)"
fi

echo "===== [3/5] npm ci ====="
npm ci

echo "===== [4/5] npm run build ====="
NODE_ENV=production npm run build

echo "===== [5/5] PM2 start/restart ====="
if pm2 list 2>/dev/null | grep -q "codex-marketplace"; then
  echo "Restarting existing PM2 process..."
  pm2 restart codex-marketplace
else
  echo "Starting new PM2 process..."
  pm2 start ecosystem.config.js
  pm2 save
  # Generate startup command
  pm2 startup systemd -u flashadmin --hp /home/flashadmin 2>&1 | tail -1
fi

echo ""
echo "===== PM2 Status ====="
pm2 status

echo ""
echo "Test Next.js on port 3001:"
sleep 3
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3001 || echo "Not yet responding — may still be starting"
