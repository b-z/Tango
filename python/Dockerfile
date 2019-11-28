FROM python:3.6.4
WORKDIR /app

COPY requirements.txt /app
RUN pip3 install -r requirements.txt
COPY . /app

CMD ["python", "app/main.py"]
