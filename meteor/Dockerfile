FROM meteorhacks/meteord:onbuild
MAINTAINER Wassim DHIF <wassimdhif@gmail.com>

ONBUILD COPY ./ /app
ONBUILD RUN bash $METEORD_DIR/on_build.sh

RUN \
	echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.0 main" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list && \
	apt-get update && apt-get upgrade -y

RUN apt-get install -y --force-yes mongodb-org-shell

COPY ./wait-mongo.sh /wait-mongo.sh

EXPOSE 80

ENTRYPOINT bash /wait-mongo.sh
