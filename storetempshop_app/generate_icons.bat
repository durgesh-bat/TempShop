@echo off
echo Generating app icons for DealsBasket Seller...
flutter pub get
flutter pub run flutter_launcher_icons:main
echo.
echo App icons generated successfully!
echo Please rebuild the app to see changes.
echo.
pause