1. Container is aimed to run on Linus Kernal, so Docker Desktop run a Linus Kernal at background
2. OCI, stands for open container initiatives, it's an open source standards for container engine.


# Docker Command List
```bash
docker version
# Engine and Client's version, 
docker info
# More detailed information about installed docker engine, 
    # info about conatainers and images
docker
# docker command list, more like help

docker container run --publish 80:80 nginx
# image downloaded from hub for nginx
# build up container from that image
# --publish, exposed the port 80 on local machine, and re-direct traffic from localhost:80 to port 80 in Docker Engine, any executable container listens port 80 within docker engine should receive the request.

# ctrl + c, cancel

docker container run --publish 80:80 --detach nginx
# --detach means make the service run in background, without this mode, the terminal will be ocupied by the running container of nginx

docker container ls
# list all containers that are running

docker container stop 690
# stop running container which id is 690*

docker container ls -a
# list all of containers no matter it's running or stopped
    # we can distinguish the container by id and name, which should be identical, and generated automatically
    # status column to show which one is running/ stopped

docker conatiner logs 690
# to show logs for 690* container

docker container top 690
# to show actual processes to the running container, this should be different count from the container, nginx should have 2 processes for one nginx running container, for example.

docker container --help
# to show all the command available for docker container

docker container rm 690 691 692
# to remove container, but this won't remove anything that is running by default, we need force mode

docker container rm -f 690
# to remove in force mode
```

3. Original Docker command format is like `docker <command> <options>`, now `docker <management command> <sub command> <options>`

4. Image vs. Container
    - Image is template, more like definition of class in programming
    - Container is the instance conducted by the image
    - We can work with registry to download/upload image, and the default registry for docker is called Docker Hub

