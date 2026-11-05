@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "MINESWEEPER_NODE=node"
where node >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
    set "MINESWEEPER_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  ) else (
    echo Installer Node.js fra https://nodejs.org og start igen.
    pause
    exit /b 1
  )
)
echo.
echo Minesweeper
echo Aabn http://localhost:44462 i din browser.
echo Lad dette vindue staa aabent, mens du spiller.
echo Stop serveren med Ctrl+C.
echo.
"%MINESWEEPER_NODE%" server.js
pause
