# 2 Setting up Your Development Environment

## Software Installation

### Image

- It is used to build a container
- It contains a blue print of a container
- To create a running instance of a container

> A read-only template composed of layered filesystems used to share common files and create Docker container instances

### Container

> An isolated and secured shipping container created from an image that can be run, started, stopped, moved and deleted.

### Example

`docker run -d -p 80:80 docker/getting-started` to run `docker/getting-started` on port 80:80, this will download docker/getting-started if it's the first time.

`docker ps -a` to list all my containers

`docker stop ${id}` to stop container id at `id`

`docker rm ${id}` to stop container id at `id`

# 3 Create an Application Images

## Understand Dockerfiles

> A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image.

A Dockerfile is compiled and build a Docker Image.

### Dockerfile Instructions

```dockerfile
FROM        node:alpine
LABEL       author="Dan Wahlin"
ENV         NODE_ENV=production
WORKDIR     /var/www (the directory that you starts when container is running)
COPY        . . (Copy everything at the directory of this dockerfile and to the WORKDIR)
RUN         npm install
EXPOSE      3000(container is listening on port 3000)
ENTRYPOINT  ["node", "server.js"]
```

[References of dockerfile instructions](https://docs.docker.com/engine/reference/builder/)

## Create a Custom Application Dockerfile

```dockerfile
# node.dockerfile
FROM        node:15.9.0-alpine

LABEL       author="Dan Wahlin"

ENV         NODE_ENV=production
ENV         PORT=3000

WORKDIR     /var/www

COPY        package.json package-lock.json ./
# copy package.json and package-lock.json into /var/www
RUN         npm install

COPY        . ./
EXPOSE      $PORT
#PORT is defined in one of the ENVs

ENTRYPOINT  ["npm", "start"]
```

```dockerfile
# .dockerignore file will ignore content defined in it
node_modules
```

## Using docker build

`docker build -t ${name} .` to build with tag of `name` and Build context of `.`(the current folder)

For example:
`docker build -t nodeapp .`

After build you can push your image to a :

- Internal Registry
- Docker Hub
- Amazon ECR
- Azure Container Registry
- Google Container Registry

`docker build -t ${registry}/${name}:${tag}` `registry` is registry name and `name` is image name, and `tag` usually is version.

For example
`docker build -t danwahlin/nodeapp:1.0`

`docker images` to list images

`docker rmi ${imageId}` to remove image of image with id of `imageId`

## Build a Custom Application Image

Before you build a image with the file `node.dockerfile`, we need to change the file name to just `dockerfile` or the docker won't find that file.

OR, we can do:

`docker build -t danwahlin/nodeapp:1.0 -f node.dockerfile .`

## Deploy an Application Image to a Registry

`docker push ${user name}/${image name}:${tag}`

`docker login` to login first before your push

`docker push danwahlin/nodeapp:1.0` this will push to docker hub by default

`docker pull danwahlin/nodeapp:1.0` to pull from docker hub

# 4 Run an Application Container

## Run an Application Container

`docker run -p ${externalPort}:${internalPort}` to run an image to create a container work at `externalPort` and `internalPort`, where `externalPort` is the port where you type in the browser, so it's external to the docker container. And `internalPort` is the port application is listening within the running container, this is defined with `EXPOSE` instruction.

## Using docker run

`docker run -p 8080:80 -d nginx:alpine`

`docker ps -a` to show all containers

`docker run --help` to get help

`docker stop ${id}` to stop container with id of `id`

`docker rm ${id}` to remove container with id of `id` without remove the image

## View Container Logs

When you encounter a problem with a container, you can use logs.

`docker logs ${id}` to show logs of a container with id of `id`

## Using Container Volumes

Volumes are used to store data outside your container, so that when container is removed, the data persists.

We can create colume in Docker Host where the container is running in. and store your logs files in this volume. So in this way, when you remove the container, the logs files persists.

`docker run -p ${ports} -v /var/www/logs ${imageToRun}`

`-v` will tell docker that everything written in `/var/www/logs`, docker will put it in volume at Docker Host.

`docker run -p ${ports} -v ''${PWD}'':/var/www/logs ${imageToRun}` to docker to write everything in `/var/www/logs` into PWD(Print Working Directory).

## Create a Container Volume

- Example 1

Suppose we have a project, which has a folder called `nginx`, we can put a `index.html` file in it. For regular Nginx program, its main page is stored in `/usr/share/nginx/html`. Therefore, we can first navigate to the `/nginx` folder and do:

`docker run -p 8080:80 -v ${PWD}:/usr/share/nginx/html nginx:alpine` to run `nginx:alpine` image and point `/usr/share/nginx/html` to the current folder(`/nginx`).

Now if we use browser to navigate to `localhost:8080`, then `index.html` we created will show up.

- Example 2

`docker run -p 3000:3000 -v ${PWD}/logs:/var/www/logs danwahlin/nodeapp:2.0` will piont `/var/www/logs` to the `basefolder/logs`

These two examples store things in Docker Host, but if the Docker Host goes down, the data is gone. There are scenarios you might want to store data in network volume, check out [here](https://docs.docker.com/storage/volumes/).

# 5 Communicate between Multiple Containers

## Create a Bridge Network

[Documentation](docs.docker.com/network/)

`docker network create --driver bridge ${network_name}`

`docker network ls`

`docker network rm ${network_name}`

- Example

`docker network create --driver bridge isolated_network`

## Run a Database Container in a Network

`docker run -d --network=${network_name} --name=${container_name} ${image_name}`

`docker run -d --network=isolated_network --name=mongoDB mongo`

## Run a Application Container in a Network

`docker run -d -p 3000:3000 --network=isolated_network --name nodeapp -p 3000:3000 -v ${PWD}/logs:/var/www/logs danwahlin/nodeapp:2.0`

so the connection will be `mongodb://mongoDB/funWithDocker`

`docker network inspect ${network_id}`

## Shell into a Container

`docker exec -it ${containerId} PowerShell`

## Building and Running Multiple Container

You can create `docker-compose.yml` file

Look at the documentation [here](https://docs.docker.com/compose/).

```yml
version: "3.7"

services:
  node:
    container_name: nodeapp
    image: nodeapp
    build:
      context: .
      dockerfile: node.dockerfile
    ports:
      - "3000:3000"
    networks:
      - nodeapp-network
    depends_on:
      - mongodb
  mongodb:
    container_name: mongodb
    image: mongo
    networks:
      - nodeapp-network

networks:
  nodeapp-network:
    driver: bridge
```

`docker-compose build`

`docker-comopse up`

`docker-compose down`
