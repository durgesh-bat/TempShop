@echo off
echo Generating DealsBasket app icons...
flutter pub get
flutter pub run flutter_launcher_icons:main
echo Icons generated successfully!
pause