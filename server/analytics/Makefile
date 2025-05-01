DB_URL=postgresql://root:root@localhost:5432/logging?sslmode=disable

network:
	docker network create bank-network

postgres:
	docker run --name postgres --network bank-network -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -d postgres:14-alpine

createdb:
	docker exec -it postgres createdb --username=root --owner=root logging

dropdb:
	docker exec -it postgres dropdb --username=root logging
