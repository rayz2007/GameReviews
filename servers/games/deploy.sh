docker build -t rayz2007/gameservice .
docker push rayz2007/gameservice

ssh ec2-user@api.gamereviewz.me < ./gameDeploy.sh