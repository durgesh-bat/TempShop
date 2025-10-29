@echo off
echo.
echo ========================================
echo    OTP FIX - Automated Setup
echo ========================================
echo.

echo Step 1: Checking OTP setup status...
python check_otp_setup.py
echo.

echo Step 2: Applying migration...
python manage.py migrate account
echo.

echo Step 3: Verifying fix...
python check_otp_setup.py
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart Django server (Ctrl+C then python manage.py runserver)
echo 2. Test OTP verification in frontend
echo.
pause
