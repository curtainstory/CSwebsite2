#!/bin/bash
# ==========================================================
# 🚀 Curtain Story Setup Script
# Author: HarshV
# Version: 1.0.0
# Description: One-click installer for Curtain Story React + Tailwind app
# ==========================================================

set -e

echo ""
echo "🧵 Welcome to Curtain Story Setup"
echo "================================="
sleep 1

# ------------------------------------------
# 1️⃣ Check dependencies
# ------------------------------------------
echo ""
echo "🔍 Checking system requirements..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found!"
  echo "➡️  Install from: https://nodejs.org/"
  exit 1
else
  echo "✅ Node.js version: $(node -v)"
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm not found!"
  echo "➡️  Install npm and try again."
  exit 1
else
  echo "✅ npm version: $(npm -v)"
fi

# ------------------------------------------
# 2️⃣ Clean old installs
# ------------------------------------------
echo ""
echo "🧹 Cleaning up old files..."
rm -rf node_modules package-lock.json dist >/dev/null 2>&1 || true
mkdir -p node_modules

# ------------------------------------------
# 3️⃣ Install dependencies
# ------------------------------------------
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# ------------------------------------------
# 4️⃣ Tailwind CSS setup
# ------------------------------------------
if [ ! -f "tailwind.config.js" ]; then
  echo ""
  echo "🎨 Tailwind CSS not detected — setting it up..."
  npx tailwindcss init -p
else
  echo "✅ Tailwind CSS already configured."
fi

# ------------------------------------------
# 5️⃣ Permissions Fix (macOS-safe)
# ------------------------------------------
echo ""
echo "🔐 Fixing npm permissions if needed..."
sudo chown -R "$(whoami)" ~/.npm >/dev/null 2>&1 || true

# ------------------------------------------
# 6️⃣ Ask user: Build or Dev mode
# ------------------------------------------
echo ""
echo "⚙️  Choose what you want to do:"
select option in "Start Dev Server" "Build for Production" "Exit"; do
  case $option in
    "Start Dev Server")
      echo ""
      echo "🚀 Launching Curtain Story in development mode..."
      npm run dev
      break
      ;;
    "Build for Production")
      echo ""
      echo "🏗️  Building Curtain Story..."
      npm run build
      echo ""
      echo "✅ Build complete! Files are inside the ./dist folder."
      echo "👉 You can preview it locally with: npm run preview"
      break
      ;;
    "Exit")
      echo "👋 Exiting setup."
      break
      ;;
    *)
      echo "❌ Invalid choice. Please try again."
      ;;
  esac
done

# ------------------------------------------
# 7️⃣ Final note and alias instructions
# ------------------------------------------
echo ""
echo "✨ Curtain Story is ready to go!"
echo "================================="
echo ""
echo "💡 Tip: You can create a one-line alias to launch this anytime:"
echo ""
echo "   echo \"alias curtainstory='./setup.sh'\" >> ~/.zshrc"
echo "   source ~/.zshrc"
echo ""
echo "Then simply type 👉  curtainstory  in your terminal to auto-start your app 🚀"
echo ""
echo "🪄 Happy designing with Curtain Story!"
echo ""
