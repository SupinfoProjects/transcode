#!/bin/bash
set -e

echo -e "\033[1m Starting ReplicaSet configuration"
mongo mongo_1:27017/transcode --eval 'rs.initiate({_id:"transcode",members:[{_id:0,host:"mongo_1:27017"},{_id:1,host:"mongo_2:27017"},{_id:2,host:"mongo_3:27017"}]});'
echo -e "\033[1m Mongo is configured - stopping setup container"
