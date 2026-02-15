#!/bin/bash
# This script helps you find the correct URLs to add to Google Cloud Console

echo "=================================================="
echo "🔍 FINDING YOUR DEV SERVER PORT"
echo "=================================================="
echo ""

# Check if dev server is running
if lsof -i :3000 >/dev/null 2>&1; then
    PORT=3000
elif lsof -i :3001 >/dev/null 2>&1; then
    PORT=3001
elif lsof -i :3002 >/dev/null 2>&1; then
    PORT=3002
elif lsof -i :5173 >/dev/null 2>&1; then
    PORT=5173
else
    echo "⚠️  Dev server doesn't seem to be running!"
    echo ""
    echo "Please run: npm run dev"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Dev server detected on port: $PORT"
echo ""
echo "=================================================="
echo "📋 ADD THESE TO GOOGLE CLOUD CONSOLE"
echo "=================================================="
echo ""
echo "Go to: https://console.cloud.google.com/apis/credentials?project=furniture-mart-10426"
echo ""
echo "Click the pencil icon (✏️) next to 'Web client'"
echo ""
echo "=== Authorized JavaScript origins ==="
echo "Add these EXACT URLs (click + ADD URI for each):"
echo ""
echo "   http://localhost:$PORT"
echo ""
echo ""
echo "=== Authorized redirect URIs ==="
echo "Add these EXACT URLs (click + ADD URI for each):"
echo ""
echo "   http://localhost:$PORT/__/auth/handler"
echo ""
echo ""
echo "=================================================="
echo "💾 SAVE & WAIT"
echo "=================================================="
echo ""
echo "1. Click SAVE button at bottom"
echo "2. ⏰ WAIT 5-10 MINUTES for Google to update"
echo "3. Close browser completely"
echo "4. Open new browser window"
echo "5. Go to: http://localhost:$PORT/login"
echo "6. Try Google Sign-In"
echo ""
echo "=================================================="
echo "Your login email: hajiashraffurnitures@gmail.com"
echo "=================================================="
