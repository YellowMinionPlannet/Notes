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

docker container top
# process list in that specific container

docker container inspect 
# details of one container config, json formatted

docker container stats 
# all containers', what they are using when running

docker container run -it
# iteractively command prompt when creating a container

docker container exec -it
# iteractive command prompt open for a existing container
# where -it means 2 things, -i means interactively keep input stdin open, -t means a terminal

docker container start -ai ubuntu
# start runing a stopped container with terminal

# the command following the -it must be something in the container's PATH, for example, if that container does not provide bash, you can't do like docker container run -it mysql bash, because bash is not in that container, you have to hack in there with sh, maybe, to download package that support bash

docker container port containername
# to give you ports info on that container

dcoker container exec -it --rm CONTAINER bash
# when exit the interactive terminal, clear the container and volume


# NetWork

docker network ls

docker network inspect

docker network create --driver

docker network connect

docker network disconnect

docker container run --link
# connect container that created at default bridge network, so that the specified container can have DNS link with the created one.
# Usually, we just create a new network, and create container in that new network, so that by default, the containers in the same network will have DNS identified by container name.

docker image tag ORIGINALIMAGENAME:TAG NEWIMAGENAME:TAG

docker image ls

docker image pull 

docker image push
```

3. Original Docker command format is like `docker <command> <options>`, now `docker <management command> <sub command> <options>`

4. Image vs. Container
    - Image is template, more like definition of class in programming
    - Container is the instance conducted by the image
    - We can work with registry to download/upload image, and the default registry for docker is called Docker Hub


5. what happens when running `docker container run`
    1. Looks ofr that image locally in image cache, if doesn't find anything go 2.
    2. Then looks in remote image repository (docker hub)
    3. downloads the latest version 
    4. create new container based on that image and prepares to start
    5. gives it a virtual IP on private network inside docker engine
    6. opens up 80 on host and forwards to port 80 inside
    7. starts container by using CMD in the DOCKERFILE


6. Concept of Docker Image
    - Image has a Image ID, which is sha, like github
    - each image is built on layers, we can show this by `docker image history` command
    - these layers is built on uppon each other like a stack
    - so different image with partially same layers will share these identical partial layers, for example, Image A with top 2 layers same with Image B, will not store the whole Image A and B, it will only store, one copy of top 2 layers, and other different layers seperately corresponding to A and B.
    - Image has 2 parts:
        1. Binaries of the application and dependencies
        2. Metadata
    - We can use `docker image inspect` to show metadata of an image
    - When we create containers by the same layer, the containers shares the same part of that image, until some container change something perticularly itself. But this won't cause the changed container got whole new stack of image, but only cause COW to the changed part/file. COW means, copy on write, it means only copy the written part to the different container.

7. ATTENTION: about `docker login`
    - ALWAYS remember to logout using `docker logout` on a shared machine, it might store a credential on the .docker/config/json file, you can use `cat .docker/config.json` to find out


