#!/bin/bash

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit
fi

echo "Installing Docker Engine"
apt-get update
apt-get install docker-engine
service docker start
service docker enable

echo "Installing Docker Compose"
curl -L https://github.com/docker/compose/releases/download/1.7.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

echo "Docker and Docker Compose installed"
echo "Run start.sh"
