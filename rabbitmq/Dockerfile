FROM rabbitmq:3-management
MAINTAINER Wassim DHIF <wassimdhif@gmail.com>

RUN \
	apt-get update && \
	apt-get install -y python

ADD rabbitmqadmin /usr/local/bin/rabbitmqadmin
RUN chmod 755 /usr/local/bin/rabbitmqadmin

EXPOSE 15672

CMD \
	service rabbitmq-server start && \
	/usr/local/bin/rabbitmqadmin declare exchange --vhost=/ name=celeryresults type=direct && \
	service rabbitmq-server stop && \
	rabbitmq-server
