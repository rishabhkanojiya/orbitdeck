-- name: AddMemberToGroup :exec
INSERT INTO group_members (group_id, member_id, created_at, updated_at)
VALUES ($1, $2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- name: GetMembersByGroup :many
SELECT m.id, m.name, m.email
FROM members m
JOIN group_members gm ON m.id = gm.member_id
WHERE gm.group_id = $1;

-- name: RemoveMemberFromGroup :exec
DELETE FROM group_members
WHERE group_id = $1 AND member_id = $2;
