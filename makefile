all:
	sudo docker-compose build
	sudo docker-compose up

re:
	sudo docker-compose build --force
