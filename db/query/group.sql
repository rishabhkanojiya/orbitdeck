-- name: CreateGroup :one
INSERT INTO groups (name, created_at, updated_at)
VALUES ($1, NOW(), NOW())
RETURNING id, name, created_at, updated_at;

-- name: GetGroupByID :one
SELECT id, name, created_at, updated_at
FROM groups
WHERE id = $1;


-- name: UpdateGroup :exec
UPDATE groups
SET name = $1, updated_at = NOW()
WHERE id = $2;

-- name: DeleteGroup :exec
DELETE FROM groups
WHERE id = $1;
