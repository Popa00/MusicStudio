@echo off
rem Avvia Music Studio e lo apre nel browser. Chiudere questa finestra spegne l'app.
rem Uso: avvia.bat              (apre il browser)
rem      avvia.bat --no-open    (non apre il browser, utile per prove)
chcp 65001 >nul
title Music Studio
rem Cerca npm, curl e where solo nel PATH, mai nella cartella corrente.
set "NoDefaultCurrentDirectoryInExePath=1"
cd /d "%~dp0"

set "URL=http://127.0.0.1:5173/"
set "OPEN=--open"
if /i "%~1"=="--no-open" set "OPEN="

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js non e' installato: scaricalo da https://nodejs.org e riprova.
  pause
  exit /b 1
)

rem Se l'app e' gia' in esecuzione, apre solo il browser.
curl -s --max-time 2 --noproxy "*" -o nul "%URL%" 2>nul
if not errorlevel 1 (
  echo Music Studio e' gia' avviato.
  if defined OPEN start "" "%URL%"
  exit /b 0
)

rem npm scrive node_modules\.package-lock.json solo a installazione completata:
rem se manca (prima volta o installazione interrotta), si reinstalla.
if not exist "node_modules\.package-lock.json" (
  echo Installazione delle dipendenze, attendi qualche minuto...
  call npm ci
  if errorlevel 1 (
    echo Installazione non riuscita.
    pause
    exit /b 1
  )
)

echo.
echo  Music Studio e' in avvio su %URL%
echo  Lascia aperta questa finestra mentre usi l'app: chiudendola, l'app si spegne.
echo.
call npm run dev -- %OPEN%
