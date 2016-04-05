FROM meteorhacks/meteord:onbuild
MAINTAINER Wassim DHIF <wassimdhif@gmail.com>

ONBUILD COPY ./ /app
ONBUILD RUN bash $METEORD_DIR/on_build.sh

RUN \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927 && \
    echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list && \
	apt-get update && apt-get upgrade -y && \
	apt-get install -y mongodb-org-shell

COPY ./wait-mongo.sh /wait-mongo.sh

EXPOSE 80

ENTRYPOINT bash /wait-mongo.sh
