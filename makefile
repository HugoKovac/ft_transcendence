all:
	sudo docker-compose build
	sudo docker-compose up

install:
	npm install --prefix ./frontend/my-app 
	npm install --prefix ./backend/source 

re:
	sudo docker-compose build --force
