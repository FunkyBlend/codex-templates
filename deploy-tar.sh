#!/usr/bin/env bash
set -euo pipefail

JUMP_HOST="flashadmin@159.65.246.230"
TARGET_HOST="flashadmin@167.71.205.41"
REMOTE_DIR="/opt/codex-marketplace"
ARCHIVE_NAME="/tmp/codexdepot-deploy.tar.gz"

echo "==> [1/5] Creating deployment archive..."
tar -czf "$ARCHIVE_NAME" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='*.log' \
  -C . . || true # Ignore the 'file changed as we read it' error if it happens

echo "==> [2/5] Transferring archive to target via jump host..."
scp -J "$JUMP_HOST" "$ARCHIVE_NAME" "$TARGET_HOST:/tmp/codexdepot-deploy.tar.gz"

echo "==> [3/5] Extracting and building on remote server..."
ssh -J "$JUMP_HOST" "$TARGET_HOST" bash <<'REMOTE'
set -euo pipefail
REMOTE_DIR="/opt/codex-marketplace"

sudo mkdir -p "$REMOTE_DIR"
sudo chown -R flashadmin:flashadmin "$REMOTE_DIR"

echo "Extracting archive..."
tar -xzf "/tmp/codexdepot-deploy.tar.gz" -C "$REMOTE_DIR"

cd "$REMOTE_DIR"

echo "Installing dependencies..."
npm install

echo "Building Next.js application..."
npm run build
REMOTE

echo "==> [4/5] Starting / restarting app with PM2..."
ssh -J "$JUMP_HOST" "$TARGET_HOST" bash <<'REMOTE'
set -euo pipefail
cd /opt/codex-marketplace

if pm2 list | grep -q "codex-marketplace"; then
  pm2 restart codex-marketplace
else
  pm2 start npm --name "codex-marketplace" -- start
  pm2 save
fi
REMOTE

echo "==> [5/5] Cleaning up local archive..."
rm "$ARCHIVE_NAME"

echo ""
echo "✅ Deployment complete!"
echo "   Site should be live at: http://167.71.205.41"
