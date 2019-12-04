docker rm -f gameclient
docker pull rayz2007/gameclient
docker run -d -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt:ro --name gameclient rayz2007/gameclient