docker network rm gameNet
docker network create gameNet
docker rm -f gamedb
docker pull rayz2007/gamedb
docker rm -f sessionStore
docker rm -f gamemongo

export MYSQL_ROOT_PASSWORD="somesecretpassword"

sleep 5

docker run -d \
-p 27017:27017 \
--name gamemongo \
--network gameNet \
mongo

sleep 5

docker run -d \
-p 6379:6379 \
--name sessionStore \
--network gameNet \
redis

sleep 5

docker run -d \
-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
-e MYSQL_DATABASE=mysql \
--name gamedb \
--network gameNet \
rayz2007/gamedb