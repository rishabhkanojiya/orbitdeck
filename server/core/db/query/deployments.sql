-- name: CreateDeployment :one
INSERT INTO deployments (name, environment, helm_release)
VALUES ($1, $2, $3)
RETURNING *;

-- name: CreateComponent :one
INSERT INTO components (deployment_id, name, replica_count, service_port)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: CreateImage :one
INSERT INTO images (component_id, repository, tag)
VALUES ($1, $2, $3)
RETURNING *;

-- name: CreateResources :one
INSERT INTO resources (component_id, requests_cpu, requests_memory, limits_cpu, limits_memory)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: CreateEnvVar :one
INSERT INTO env_vars (component_id, key, value)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetDeployment :one
SELECT * FROM deployments WHERE id = $1;

-- name: GetDeploymentComponents :many
SELECT 
    c.*,
    i.repository,
    i.tag,
    r.requests_cpu,
    r.requests_memory,
    r.limits_cpu,
    r.limits_memory
FROM components c
LEFT JOIN images i ON i.component_id = c.id
LEFT JOIN resources r ON r.component_id = c.id
WHERE c.deployment_id = $1;