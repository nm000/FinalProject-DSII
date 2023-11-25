FROM python:3.8

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 5001

CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "5001"]
