@echo off
echo ========================================
echo Applying OTP Migration
echo ========================================
echo.

echo Step 1: Making migrations...
python manage.py makemigrations account

echo.
echo Step 2: Applying migrations...
python manage.py migrate account

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo You can now use the OTP verification feature.
echo.
pause
