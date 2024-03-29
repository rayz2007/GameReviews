#!/usr/bin/env bash
docker rm -f gameservice

docker pull rayz2007/gameservice

# Export environment variables
export MONGOADDR="mongodb://gamemongo:27017/gamesdb"

# Run microservice
docker run -d \
    --name gameservice \
    --network gamenet \
    -e MONGOADDR=$MONGOADDR \
    rayz2007/gameservice:latest