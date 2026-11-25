@echo off
echo off

call 00-environment.bat

echo Getting current requirements
%Directory_PythonEnv%\Scripts\python -m pip freeze > %RequirementsFile%

pause