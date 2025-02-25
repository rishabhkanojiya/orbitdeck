-- name: CreateIngress :one
INSERT INTO ingresses (deployment_id, host, path, service_port)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetIngressByDeployment :many
SELECT * FROM ingresses WHERE deployment_id = $1;

-- name: GetIngressByHost :one
SELECT * FROM ingresses WHERE host = $1 LIMIT 1;

-- name: DeleteIngress :exec
DELETE FROM ingresses WHERE id = $1;
