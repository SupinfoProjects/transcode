#!/bin/bash

if [ -n "$1" ]; then
    cd worker
    ./workers.sh $1 $2
    cd ../core
    ./core.sh $1
    cd ..
else
    echo "Usage: test.sh start|stop|restart [10]"
fi
