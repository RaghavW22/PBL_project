@echo off
title ReportSarthi - AI Medical Report Decoder
color 0b
echo ================================================================
echo   Starting ReportSarthi AI Microservice ^& Vite Frontend...
echo ================================================================

cd /d "%~dp0"
node runner.js
pause
