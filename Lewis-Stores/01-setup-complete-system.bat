@echo off
REM Lewis Stores root-level setup launcher
REM For convenience, forwards to the actual setup script in setup-scripts

set "ROOT_DIR=%~dp0"
call "%ROOT_DIR%setup-scripts\01-setup-complete-system.bat" %*
