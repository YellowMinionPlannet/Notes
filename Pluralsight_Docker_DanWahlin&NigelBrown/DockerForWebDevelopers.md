# 5 Hooking Your Source Code into a Container

`docker ps -a`

list all containers

## The Layered File System

- Image is built up with layered files, and these layers are read only.
- When we build container by image, the container will have a read and write layer in it, so that we can write logs and data into database etc.
- When we build containers by one images, each of those containers has its own read and write layer, but all shares the same layered file, so that once layered file is downloaded, other container won't need to download it again.
- When container is deleted, the read and write layer is gone too. If we wanna keep the written datas, we need volumes.

## Containers and Volumes

- A special type of directory in a container.
- Can be shared and reused among containers
- Updates to an image won't affect a volume
- Are persisted even after the container is deleted.
- Volume actually lives in docker host where containers are hosted

## Source Code, Volumes, and Containers

`docker run -p 8080:3000 -v /var/www node`

The `-v` command create a volume at `/var/www`.

So what happens?

If we run another command: `docker inspect node`. It will gives us something like

```json
//docker inspect outputs:
//...
"Mounts":[
    {
        "Name": "derjqweoirpqewuir",
        "Source": "/mnt/.../var/lib/docker/volumes/derjqweoirpqewuir/_data", //docker host location
        "Destination": "/var/www", //volume location
        "Driver": "local",
        "RW": true
    }
]
//...
```

And we can customize the source path in docker host:

`docker run -p 8080:3000 -v $(PWD):/var/www node`

where `$(PWD)` position is the source path position, here the `$(PWD)` represents current working directory.

## Hooking a Volume to Node.js Source Code

`docker rm -v 03` will remove container 03 and also the volume

For example, when we have node latest image and run it, because there's no source code(code for a executable project), so the container will exit after we run it.

But if we have some nodejs project that are executable, we can link this project(folder) to the volume of node container. So when we run the node container, it will automatically run the nodejs project.

We can link the folder by:

1. move to the nodejs project folder, and
2. use `docker run -p 8080:3000 -v ${PWD}:/var/www -w "/var/www" node npm start`

> NOTE: about current working directory, please see [pwd_in_different_OS](https://blog.codewithdan.com/docker-volumes-and-print-working-directory-pwd)

`-w` will make sure your `npm start` will run in `/var/www`.

## Hooking a Volume to ASP.NET Source Code

`dotnet new mvc` to create a new MVC project

`docker pull mcr.microsoft.com/dotnet/core/sdk` pull dotnet core sdk image

`docker run -it -p 8080:5000 -v %cd%:/app -w "/app" mcr.microsoft.com/dotnet/core/sdk /bin/bash`

We need to change some config in `launchSettings.json` too

```json
//launchSettings.json
//...
"demos":{
    "commandName": "Project",
    "launchBrowser": true,
    "applicationUrl": "http://+:5000", //Update here
    "environmentVariables":{
        "ASPNETCORE_ENVIRONMENT": "Development"
    }
}
//...
```

As you in the project

`dotnet watch run`

## Removing Containers and Volumes

`docker rm -v node` this `-v` will remove volume while removing container.

# 6 Building Custom Images with Dockerfile

## Getting Started with Dockerfile

There are several commands that are commonly used when building image:

- FROM: you can't create image from scratch, so what is the base image
- LABEL: latest/author
- RUN: what commands you want to execute
- COPY: copy source code from which volume
- ENTRYPOINT: the entrypoint of your container
- WORKDIR: the working directory of your container
- EXPOSE: the port setups
- ENV: evironment variables setups
- VOLUME: setup the volume path

For example:

```dockerfile
FROM node
LABEL author="Dan"
COPY . /var/www
WORKDIR /var/www
RUN npm install
EXPOSE 8080
ENTRYPOINT ["node", "server.js"]
```

## Creating a Custom Node.js Dockerfile

```dockerfile
# node.dockerfile
FROM node:latest
LABEL author="Dan Wahlin"
ENV NODE_ENV=production
ENV PORT=3000
COPY . /var/www
WORKDIR /var/www
VOLUME ["/var/www", "/logs"]
RUN npm install
EXPOSE $PORT
ENTRYPOINT ["npm","start"]
```

## Building a Node.js Image

`docker build -f node.dockerfile -t danwahlin/node .`

> Don't forget `.` means the current folder
