@echo off
echo off

set Directory_PythonEnv=.venv

set RequirementsFile=requirements.txt

set "FlaskPort=8080"
set "MySQLPort=3307"

rem Os scripts de contentores executam "<motor> compose".
rem set ContainerBinary=podman
set ContainerBinary=docker

rem O comando "podman compose" é um encaminhador; força o fornecedor Podman
rem para evitar que seja selecionado o docker-compose instalado no sistema.
if /I "%ContainerBinary%"=="podman" set PODMAN_COMPOSE_PROVIDER=podman-compose

set ComposeFile=Compose.yaml
set ProjectName=Queta
