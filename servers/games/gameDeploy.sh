#!/usr/bin/env bash
docker rm -f gameservice

docker pull rayz2007/gameservice

# Export environment variables
export MONGOADDR="mongodb://messagemongo:27017/gamedb"

# Run microservice
docker run -d \
    --name gameservice \
    --network gameNet \
    -e MONGOADDR=$MONGOADDR \
    rayz2007/gameservice:latest