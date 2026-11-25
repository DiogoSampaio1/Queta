FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src

EXPOSE 80

CMD ["python", "-m", "flask", "--app", "src.Server:app", "run", "--debug", "--host=0.0.0.0", "--port=80"]
