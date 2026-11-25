@echo off
call 00-environment.bat

rem Inicia a aplicação Flask e as bases de dados em contentores.
%ContainerBinary% compose -p %ProjectName% -f %ComposeFile% up -d

start "" http://localhost:%FlaskPort%/
