export IMAGE=trial-nodejs
docker built -t $IMAGE .
docker run -p 8080:8080 -ti $IMAGE
