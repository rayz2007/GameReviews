sh ./build.sh
docker push rayz2007/gameapi
docker push rayz2007/gameuserdb
ssh ec2-user@api.gamereviewz.me < ./apiDeploy.sh
