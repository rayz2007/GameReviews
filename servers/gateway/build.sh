GOOS=linux go build
docker build -t harik98/info441finalapi .
docker build -t harik98/gamedb ../db
go clean

docker push harik98/info441finalapi
docker push harik98/gamedb