docker rm -f customMongoContainer
docker rm -f mysqldb


docker run -d \
	-p 27017:27017 \
	--name customMongoContainer \
	mongo

export MYSQL_ROOT_PASSWORD="somepass"

docker run -d \
	--name mysqldb \
	-p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    -e MYSQL_DATABASE=demo \
	mysql