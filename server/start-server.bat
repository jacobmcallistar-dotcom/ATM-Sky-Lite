@echo off
title ATM Sky Lite server
cd /d "%~dp0"
echo Starting ATM Sky Lite server...
echo (type "stop" to shut down cleanly - never just close this window)
echo.
"%~dp0runtime\jdk17\bin\java.exe" @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.20.1-47.3.0/win_args.txt nogui
echo.
echo Server stopped. Press any key to close.
pause >nul
