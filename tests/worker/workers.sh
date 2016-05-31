#!/bin/bash

if [ -n "$1" ]; then
    names=""
    for (( i=1; i<=${2-"10"}; i++ )) do names+="worker$i "; done
    celery multi $1 ${names} --pidfile=pids/%n.pid -A worker -l info -f logs/%n.log
else
    echo "Usage: workers.sh start|stop|restart [10]"
fi
