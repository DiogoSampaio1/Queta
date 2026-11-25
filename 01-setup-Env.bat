@echo off
echo off

call 00-environment.bat

echo Creating Python environment...
python -m venv %Directory_PythonEnv%

echo Updating pip...
%Directory_PythonEnv%\Scripts\python.exe -m pip install --upgrade pip

echo Installing Python modules...
%Directory_PythonEnv%\Scripts\python.exe -m pip install -r %RequirementsFile%

pause
