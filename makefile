all:
	docker-compose build
	docker-compose up
install:
	npm install --prefix ./frontend/my-app 
	npm install --prefix ./backend/source 
re:
	docker-compose build --force
