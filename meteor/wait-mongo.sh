#!/bin/bash

set -e

id=1
members=()
IFS=',' read -ra hosts <<< "${PRIMARY_MEMBER},${SECONDARY_MEMBERS}"
for host in "${hosts[@]}"; do
    members+=("{_id:${id},host:'${host}'}")
    ((id++))
done
members_js=`echo $(IFS=,; echo "${members[*]}")`
js="rs.initiate({_id:'${REPLICA_SET_ID}',members:[${members_js}]});"

until mongo --host "${REPLICA_SET_ID}/${PRIMARY_MEMBER},${SECONDARY_MEMBERS}" "${DATABASE}"; do
  >&2 echo "mongo --host ${REPLICA_SET_ID}/${PRIMARY_MEMBER},${SECONDARY_MEMBERS} ${DATABASE}"
  >&2 echo "Mongo is unavailable - sleeping"
  sleep 1
done

>&2 echo "Mongo is up - executing command"
chmod +x $METEORD_DIR/run_app.sh
exec $METEORD_DIR/run_app.sh
