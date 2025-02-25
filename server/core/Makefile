DB_URL=postgresql://root:root@localhost:5432/core?sslmode=disable

network:
	docker network create bank-network

postgres:
	docker run --name postgres --network bank-network -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -d postgres:14-alpine

createdb:
	docker exec -it postgres createdb --username=root --owner=root core

dropdb:
	docker exec -it postgres dropdb --username=root core

migrateup:
	migrate -path db/migration -database "$(DB_URL)" -verbose up

migrateup1:
	migrate -path db/migration -database "$(DB_URL)" -verbose up 1

migratedown:
	migrate -path db/migration -database "$(DB_URL)" -verbose down

migratedown1:
	migrate -path db/migration -database "$(DB_URL)" -verbose down 1

new_migration:
	migrate create -ext sql -dir db/migration -seq $(name)

sqlc:
	sqlc generate

server:
	go run main.go

run:
	nodemon --exec go run main.go --signal SIGTERM

redis:
	docker run --name redis -p 6379:6379 -d redis:7-alpine

.PHONY:redis mock server test createdb dropdb migrateup migratedown migrateup1 migratedown1 new_migration sqlc