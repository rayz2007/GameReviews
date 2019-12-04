docker network rm gamenet
docker network create gamenet
docker rm -f gameuserdb
docker pull rayz2007/gameuserdb
docker rm -f sessionStore
docker rm -f gamemongo

export MYSQL_ROOT_PASSWORD="somesecretpassword"

sleep 5

docker run -d \
-p 27017:27017 \
--name gamemongo \
--network gamenet \
mongo

sleep 5

docker run -d \
-p 6379:6379 \
--name sessionStore \
--network gamenet \
redis

sleep 5

docker run -d \
-e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
-e MYSQL_DATABASE=mysql \
--name gameuserdb \
--network gamenet \
rayz2007/gameuserdb