#!/bin/bash

if ! [ $(id -u) = 0 ]; then
    echo "Please run as root"
    exit
fi

echo "Stopping all containers"
docker stop {docker ps -a -q}
echo "Deleting all containers"
docker rm {docker ps -a -q}
echo "Deleting all images"
docker rmi {docker images -q}
echo "All docker containers and images have been stopped and deleted"
