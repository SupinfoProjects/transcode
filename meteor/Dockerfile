FROM meteorhacks/meteord:onbuild
MAINTAINER Wassim DHIF <wassimdhif@gmail.com>



ONBUILD COPY ./ /app
ONBUILD COPY ../scripts/wait-mongo.sh $METEORD_DIR/wait-mongo.sh
ONBUILD RUN bash $METEORD_DIR/wait-mongo.sh
ONBUILD RUN bash $METEORD_DIR/on_build.sh