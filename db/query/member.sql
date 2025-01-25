-- name: CreateMember :one
INSERT INTO members (name, email, created_at, updated_at)
VALUES ($1, $2, NOW(), NOW())
RETURNING id, name, email, created_at, updated_at;

-- name: GetMemberByID :one
SELECT id, name, email, created_at, updated_at
FROM members
WHERE id = $1;

-- name: UpdateMember :exec
UPDATE members
SET name = $1, email = $2, updated_at = NOW()
WHERE id = $3;

-- name: DeleteMember :exec
DELETE FROM members
WHERE id = $1;
