@echo off
title Xplore App Starter

:: Start Django backend server
start cmd /k "py manage.py runserver"

:: Start React frontend server
start cmd /k "cd frontend && npm start"

echo Xplore application is starting...
echo Backend server: http://localhost:8000
echo Frontend server: http://localhost:3000

:: This keeps the main terminal window open
pause
