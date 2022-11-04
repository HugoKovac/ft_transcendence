FROM ubuntu:latest

WORKDIR /usr/src/app/

RUN apt-get update && \
	apt-get install curl -y && \
	curl -fsSL https://deb.nodesource.com/setup_16.x | bash && \
	apt install nodejs -y

ENTRYPOINT [ "npm", "start" ] 
