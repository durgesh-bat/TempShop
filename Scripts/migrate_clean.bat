@echo off
echo ========================================
echo TempShop Database Clean Migration
echo ========================================
echo.
echo WARNING: This will DELETE ALL DATA!
echo Make sure you have a backup before proceeding.
echo.
pause

echo.
echo Step 1: Deleting migration files...
del /Q account\migrations\0*.py 2>nul
del /Q cart\migrations\0*.py 2>nul
del /Q product\migrations\0*.py 2>nul
del /Q shopkeeper\migrations\0*.py 2>nul
echo Migration files deleted.

echo.
echo Step 2: Please run the drop_tables.sql script in PostgreSQL now.
echo Connect to your database and run: \i drop_tables.sql
echo.
pause

echo.
echo Step 3: Creating fresh migrations...
python manage.py makemigrations account
python manage.py makemigrations shopkeeper
python manage.py makemigrations product
python manage.py makemigrations cart
echo Migrations created.

echo.
echo Step 4: Applying migrations...
python manage.py migrate
echo Migrations applied.

echo.
echo Step 5: Creating superuser...
echo Please create a superuser account:
python manage.py createsuperuser

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Test client registration and login
echo 2. Test shopkeeper registration and login
echo 3. Update frontend to use integer IDs instead of UUIDs
echo.
pause
