CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    deployment_id BIGINT,
    component_id BIGINT,
    component TEXT,
    repository TEXT,
    status TEXT,
    user_email TEXT,
    meta TEXT,
    timestamp TIMESTAMP NOT NULL
);
