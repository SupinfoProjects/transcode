FROM python:3.4-slim
MAINTAINER Wassim DHIF <wassimdhif@gmail.com>

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user
WORKDIR /home/user

RUN \
	echo "deb http://httpredir.debian.org/debian jessie-backports main contrib non-free" >> /etc/apt/sources.list && \
	apt-get update && \
	apt-get upgrade -y && \
	apt-get install -y ffmpeg

RUN \
	pip install --upgrade pip && \
	pip install redis

ENV CELERY_VERSION 3.1.23

RUN pip install celery=="$CELERY_VERSION"

RUN { \
	echo 'import os'; \
	echo "BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'amqp://')"; \
} > celeryconfig.py

ENV CELERY_BROKER_URL amqp://guest@rabbit

USER user
CMD ["celery", "worker"]
