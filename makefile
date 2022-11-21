all:
	docker-compose build
	docker-compose up

re:
	docker-compose build --force
