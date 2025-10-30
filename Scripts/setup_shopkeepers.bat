@echo off
echo ========================================
echo   TempShop Shopkeeper Setup
echo ========================================
echo.

echo [1/3] Running migrations...
python manage.py migrate
if %errorlevel% neq 0 (
    echo ERROR: Migration failed!
    pause
    exit /b 1
)
echo.

echo [2/3] Seeding shopkeepers...
python manage.py seed_shopkeepers
if %errorlevel% neq 0 (
    echo ERROR: Seeding failed!
    pause
    exit /b 1
)
echo.

echo [3/3] Setup complete!
echo.
echo ========================================
echo   Shopkeeper Accounts Created
echo ========================================
echo.
echo Username: shop_electronics
echo Username: shop_fashion
echo Username: shop_home
echo Username: shop_sports
echo Username: shop_books
echo Username: shop_toys
echo Username: shop_beauty
echo Username: shop_grocery
echo Username: shop_furniture
echo Username: shop_jewelry
echo.
echo Default Password: shopkeeper123
echo.
echo ========================================
echo   Next Steps
echo ========================================
echo.
echo 1. Start server: python manage.py runserver
echo 2. Login as shopkeeper at /api/shopkeeper/login/
echo 3. Access dashboard at /api/shopkeeper/dashboard/
echo.
echo See SHOPKEEPER_GUIDE.md for full documentation
echo.
pause
