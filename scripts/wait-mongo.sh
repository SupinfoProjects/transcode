#!/bin/bash

set -e

until mongo mongodb://mongo_1,mongo_2,mongo_3/transcode?replicaSet=transcode; do
  >&2 echo "Mongo is unavailable - sleeping"
  sleep 1
done

>&2 echo "Mongo is up - executing command"
exec $METEORD_DIR/on_build.sh
