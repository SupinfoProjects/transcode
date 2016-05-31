#!/bin/bash

if [ -n "$1" ]; then
    celery multi $1 core -l info
else
    echo "Usage: core.sh start|stop|restart"
fi
