@echo off
REM Cleanly stop the running ATM Sky Lite server via RCON (saves the world, then shuts down).
REM The server must be running with enable-rcon=true (already set in server.properties).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0rcon-cmd.ps1" -Cmd "stop"
