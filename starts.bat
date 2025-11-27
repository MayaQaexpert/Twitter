@echo off
setlocal enabledelayedexpansion

REM Colors for Windows (using color codes)
set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

echo %BLUE%========================================%NC%
echo %BLUE%   Starting Twitter Clone Application%NC%
echo %BLUE%========================================%NC%
echo.

REM Check if MongoDB is already running
echo %YELLOW%Checking MongoDB status...%NC%
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo %GREEN%√ MongoDB is already running%NC%
) else (
    echo %YELLOW%Starting MongoDB...%NC%
    
    REM Start MongoDB as a service (if installed as service)
    net start MongoDB 2>NUL
    if "%ERRORLEVEL%"=="0" (
        echo %GREEN%√ MongoDB started successfully as service%NC%
    ) else (
        REM If not a service, try to start MongoDB directly
        echo %YELLOW%MongoDB service not found, starting manually...%NC%
        start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
        timeout /t 3 /nobreak >NUL
        
        tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
        if "!ERRORLEVEL!"=="0" (
            echo %GREEN%√ MongoDB started successfully%NC%
        ) else (
            echo %RED%× Failed to start MongoDB%NC%
            echo %YELLOW%Please ensure MongoDB is installed and the path is correct%NC%
            pause
            exit /b 1
        )
    )
)

echo.
echo %YELLOW%Starting Next.js development server...%NC%
echo %BLUE%========================================%NC%
echo.

REM Start npm dev server
npm run dev