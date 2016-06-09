#!/bin/bash

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit
fi

cd ../
echo "Starting Transcode"
docker-compose up -d
echo "Transcode started"
echo "Balancer IP Address"
docker inspect transcode_balancer_1  | grep "\"IPAddress\":"
