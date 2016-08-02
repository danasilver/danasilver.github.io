#!/usr/bin/env bash

kill $(cat /tmp/baby-names-service.pid /tmp/baby-names-mongod.pid)

rm /tmp/baby-names-service.pid /tmp/baby-names-mongod.pid
