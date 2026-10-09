@echo off
title Есть повод — запуск приложения

cd /d C:\Users\knigh\Desktop\telegram-greeting-app

echo.
echo ========================================
echo      ЕСТЬ ПОВОД — запуск приложения
echo ========================================
echo.

echo [1/2] Запускаем православный backend...
start "Православный backend" cmd /k "cd /d C:\Users\knigh\Desktop\telegram-greeting-app && node server/azbyka.js"

timeout /t 2 /nobreak >nul

echo [2/2] Запускаем frontend...
start "Frontend" cmd /k "cd /d C:\Users\knigh\Desktop\telegram-greeting-app && npm run dev"

echo.
echo ========================================
echo      Все запущено!
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:3001
echo.
echo Это окно можно закрыть.
echo Два других окна оставьте открытыми.
echo.

pause