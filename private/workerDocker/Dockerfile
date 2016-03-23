FROM ubuntu:trusty
MAINTAINER Wassim DHIF <wassimdhif@gmail.com>

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    ffmpeg \
    python \
    python-dev \
    python-setuptools
RUN mkdir -p /opt/celeryd
RUN pip install celery

ADD celeryconfig.py /opt/celeryd/celeryconfig.py

VOLUME ["/opt/celeryd/tasks"]

ENTRYPOINT service rabbitmq-server start && celery -A tasks worker

EXPOSE 5672
EXPOSE 27017
