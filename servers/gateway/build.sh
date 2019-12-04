GOOS=linux go build
docker build -t rayz2007/gameapi .
docker build -t rayz2007/gameuserdb ../db
go clean