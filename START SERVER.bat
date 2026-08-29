@echo off
title Relax Tax - Local Server
echo.
echo   Starting the Relax Tax website...
echo   Keep this window open while you work.
echo.
cd /d "%~dp0"
start "" http://localhost:3090
node serve.mjs
pause
