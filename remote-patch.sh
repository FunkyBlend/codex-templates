ssh -J flashadmin@159.65.246.230 flashadmin@167.71.205.41 bash <<'REMOTE'
set -euo pipefail
cd /opt/codex-marketplace

cat << 'EOF' > src/app/page.tsx
$(cat src/app/page.tsx)
EOF

echo "Building Next.js application..."
npm run build

echo "Restarting app with PM2..."
pm2 restart codex-marketplace
echo "Done!"
REMOTE
