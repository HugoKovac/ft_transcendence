FROM ubuntu:latest

WORKDIR /usr/src/app/

RUN apt-get update && \
	apt-get install npm -y

CMD [ "npm", "install", "--dev" ] 
ENTRYPOINT [ "npm", "run", "start:dev" ] 
#change for prod
