set IMAGE simple-http-server;
docker built -t $IMAGE .;
docker run -ti $IMAGE