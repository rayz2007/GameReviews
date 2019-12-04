docker rm -f gameapi
docker pull rayz2007/gameapi

export MYSQL_ROOT_PASSWORD="somesecretpassword"
export DSN="root:$MYSQL_ROOT_PASSWORD@tcp(gameuserdb:3306)/mysql"
export REDISADDR="sessionStore:6379"
export SESSIONKEY="mySessionKey"
export GAMEADDR="gameservice:4000"

sleep 5
docker run -d -p 443:443 -e ADDR:=443  -e GAMEADDR=$GAMEADDR -e TLSKEY=/etc/letsencrypt/live/api.gamereviewz.me/privkey.pem -e TLSCERT=/etc/letsencrypt/live/api.gamereviewz.me/fullchain.pem -v /etc/letsencrypt:/etc/letsencrypt:ro -e REDISADDR=$REDISADDR -e SESSIONKEY=$SESSIONKEY -e DSN=$DSN --name gameapi --network gamenet rayz2007/gameapi
