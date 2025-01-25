DB_URL=postgresql://root:root@localhost:5432/simple_bank?sslmode=disable

createdb:
	createdb --username=root --owner=root simple_bank

dropdb:
	dropdb --username=root simple_bank

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

test:
	make migratedown
	make migrateup
	go test -v -cover ./...

server:
	clear && go run main.go

mock:
	mockgen -package mock_db -destination db/mock/store.go simple_bank/db/sqlc Store
	mockgen -package mock_wk -destination worker/mock/distributor.go simple_bank/worker TaskDistributor

redis:
	docker run --name redis -p 6379:6379 -d redis:7-alpine

.PHONY:redis mock server test createdb dropdb migrateup migratedown migrateup1 migratedown1 new_migration sqlc