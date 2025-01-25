DB_URL=postgresql://root:root@localhost:5432/controlcore?sslmode=disable

createdb:
	createdb --username=root --owner=root controlcore

dropdb:
	dropdb --username=root controlcore

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
	clear && go run main.go

redis:
	docker run --name redis -p 6379:6379 -d redis:7-alpine

.PHONY:redis mock server test createdb dropdb migrateup migratedown migrateup1 migratedown1 new_migration sqlc