@echo off
setlocal

set PRIVATE_KEY=jwt_private.pem
set PUBLIC_KEY=jwt_public.pem

echo 🔐 Generating RSA private key (%PRIVATE_KEY%)...
openssl genrsa -out %PRIVATE_KEY% 4096 >nul 2>&1

if not exist %PRIVATE_KEY% (
    echo ❌ Failed to generate private key.
    exit /b 1
)

echo 📤 Extracting public key (%PUBLIC_KEY%)...
openssl rsa -in %PRIVATE_KEY% -pubout -out %PUBLIC_KEY% >nul 2>&1

if exist %PUBLIC_KEY% (
    echo ✅ Keys generated successfully!
    echo.
    echo Private key: %PRIVATE_KEY%
    echo Public key : %PUBLIC_KEY%
) else (
    echo ❌ Failed to extract public key.
    exit /b 1
)

echo.
echo ---- PRIVATE KEY (first few lines) ----
powershell -Command "Get-Content %PRIVATE_KEY% | Select-Object -First 5"
echo ...
echo ---- PUBLIC KEY ----
type %PUBLIC_KEY%
echo.

endlocal
pause
