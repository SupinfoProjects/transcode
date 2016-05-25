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
  >&2 echo -e "\033[1m mongo --host ${REPLICA_SET_ID}/${PRIMARY_MEMBER},${SECONDARY_MEMBERS} ${DATABASE}"
  >&2 echo -e "\033[1m Mongo is unavailable - sleeping"
  sleep 1
done

>&2 echo -e "\033[1m Mongo is up - Starting meteor"
chmod +x $METEORD_DIR/run_app.sh
exec $METEORD_DIR/run_app.sh
