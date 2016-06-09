#!/bin/bash

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit
fi

cd ../
echo "Stopping Transcode"
docker-compose down
echo "Transcode stopped"
