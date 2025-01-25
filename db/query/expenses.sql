-- name: CreateExpense :one
INSERT INTO expenses (group_id, member_id, description, amount, created_at, updated_at)
VALUES ($1, $2, $3, $4, NOW(), NOW())
RETURNING id, group_id, member_id, description, amount, created_at, updated_at;

-- name: GetExpensesByGroup :many
SELECT e.id, e.group_id, e.member_id, e.description, e.amount, e.created_at, e.updated_at
FROM expenses e
WHERE e.group_id = $1
ORDER BY e.created_at DESC;

-- name: UpdateExpense :exec
UPDATE expenses
SET description = $1, amount = $2, updated_at = NOW()
WHERE id = $3;

-- name: DeleteExpense :exec
DELETE FROM expenses
WHERE id = $1;
