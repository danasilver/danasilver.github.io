#!/usr/bin/env bash

pushd . > /dev/null
cd "../baby-names-service"
mongod --dbpath=tmp --port 27017 >/dev/null 2>&1 &
echo $! > /tmp/baby-names-mongod.pid
npm start > /dev/null 2>&1 &
echo $! > /tmp/baby-names-service.pid
popd > /dev/null

http-server
