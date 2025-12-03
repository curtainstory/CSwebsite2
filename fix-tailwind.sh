#!/bin/bash
echo "🧹 Cleaning up old Tailwind installation..."
rm -rf node_modules package-lock.json
npm cache clean --force

echo "📦 Reinstalling dependencies..."
npm install

echo "🎨 Installing Tailwind CLI and PostCSS plugins..."
npm install -D tailwindcss tailwindcss-cli @tailwindcss/postcss postcss autoprefixer

echo "🔗 Verifying CLI..."
if npx tailwindcss -v > /dev/null 2>&1; then
  echo "✅ Tailwind CLI working!"
else
  echo "⚠️ CLI not found! Please rerun npm install -D tailwindcss-cli"
fi

echo "🎉 Done! Run npm run dev to start your project."
