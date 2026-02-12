#!/bin/bash

echo "🚀 Setting up AJALI Backend..."
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not activated!"
    echo "Please run: source venv/bin/activate"
    exit 1
fi

echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "🗄️  Creating database tables..."
python3 init_db.py

echo ""
echo "👤 Creating admin account..."
python3 seed_admin.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  python run.py"
echo ""
echo "Admin credentials:"
echo "  Email: admin@ajali.com"
echo "  Password: Admin123"
