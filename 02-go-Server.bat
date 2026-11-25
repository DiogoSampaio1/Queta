@echo off
echo off

call 00-environment.bat

echo Starting the Flask server locally (without a Python application container)...
echo Local mode reads the students from the JSON file; no database configuration is needed.

set FLASK_APP=src.Server:app

set FLASK_BIN=%Directory_PythonEnv%\Scripts\flask
start %FLASK_BIN% --app %FLASK_APP% run --debug --port %FlaskPort% --host=0.0.0.0

timeout 3

start "" http://localhost:%FlaskPort%/
