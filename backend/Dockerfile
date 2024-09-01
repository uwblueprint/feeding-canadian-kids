FROM python:3.12.5
WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./app

EXPOSE 5000
ENTRYPOINT ["python", "server.py"]
