-- name: CreateCore :one
INSERT INTO cores (
  owner,
  balance,
  currency
) VALUES (
  $1, $2, $3
) RETURNING *;

-- name: GetCore :one
SELECT * FROM cores
WHERE id = $1 LIMIT 1;

-- name: GetCoreForUpdate :one
SELECT * FROM cores
WHERE id = $1 LIMIT 1
FOR NO KEY UPDATE;

-- name: ListCores :many
SELECT * FROM cores
WHERE owner = $1
ORDER BY id
LIMIT $2
OFFSET $3;

-- name: UpdateCore :one
UPDATE cores
SET balance = $2
WHERE id = $1
RETURNING *;

-- name: AddCoreBalance :one
UPDATE cores
SET balance = balance + sqlc.arg(amount)
WHERE id = sqlc.arg(id)
RETURNING *;

-- name: DeleteCore :exec
DELETE FROM cores
WHERE id = $1;