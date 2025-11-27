@echo off
setlocal

REM Colors for Windows
set "BLUE=[94m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "NC=[0m"

echo %BLUE%========================================%NC%
echo %BLUE%   Stopping Twitter Clone Application%NC%
echo %BLUE%========================================%NC%
echo.

REM Stop Next.js dev server (Node processes)
echo %YELLOW%Stopping Next.js development server...%NC%
taskkill /F /IM node.exe 2>NUL
if "%ERRORLEVEL%"=="0" (
    echo %GREEN%√ Next.js server stopped%NC%
) else (
    echo %YELLOW%! Next.js server was not running%NC%
)

echo.

REM Stop MongoDB
echo %YELLOW%Stopping MongoDB...%NC%

REM Try to stop as service first
net stop MongoDB 2>NUL
if "%ERRORLEVEL%"=="0" (
    echo %GREEN%√ MongoDB service stopped%NC%
) else (
    REM If not a service, kill the process
    taskkill /F /IM mongod.exe 2>NUL
    if "%ERRORLEVEL%"=="0" (
        echo %GREEN%√ MongoDB process stopped%NC%
    ) else (
        echo %YELLOW%! MongoDB was not running%NC%
    )
)

echo.
echo %GREEN%All services stopped successfully!%NC%
echo.
pause