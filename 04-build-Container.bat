@echo off
echo off

call 00-environment.bat

rem Constrói a imagem da aplicação Flask definida no Compose.
%ContainerBinary% compose -p %ProjectName% -f %ComposeFile% build app

pause
