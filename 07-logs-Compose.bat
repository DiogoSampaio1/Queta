@echo off
call 00-environment.bat
%ContainerBinary% compose -p %ProjectName% -f %ComposeFile% logs -f app mysql-db
