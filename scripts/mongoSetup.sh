#!/bin/bash
set -e

apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
apt-get update
apt-get install -y mongodb-org

until mongo mongo_1:27017/transcode; do
  >&2 echo "Mongo is unavailable - sleeping"
  sleep 1
done

>&2 echo "Mongo is up - executing command"
mongo mongo_1:27017/transcode --eval 'rs.initiate({_id:"transcode",members:[{_id:0,host:"mongo_1:27017"},{_id:1,host:"mongo_2:27017"},{_id:2,host:"mongo_3:27017"}]});'
