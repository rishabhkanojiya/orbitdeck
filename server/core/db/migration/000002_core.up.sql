CREATE TYPE "environment" AS ENUM ('dev', 'staging', 'prod');

CREATE TABLE "deployments" (
    "id" bigserial PRIMARY KEY,
    "name" varchar NOT NULL,
    "environment" "environment" NOT NULL DEFAULT 'dev',
    "helm_release" varchar,
    "task_id" varchar,
    "status" varchar,
    "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "components" (
    "id" bigserial PRIMARY KEY,
    "deployment_id" bigint NOT NULL REFERENCES "deployments"("id") ON DELETE CASCADE,
    "name" varchar NOT NULL,
    "replica_count" integer NOT NULL DEFAULT 1,
    "service_port" integer
);

CREATE TABLE "images" (
    "id" bigserial PRIMARY KEY,
    "component_id" bigint NOT NULL REFERENCES "components"("id") ON DELETE CASCADE,
    "repository" varchar NOT NULL,
    "tag" varchar NOT NULL DEFAULT 'latest'
);

CREATE TABLE "resources" (
    "id" bigserial PRIMARY KEY,
    "component_id" bigint NOT NULL REFERENCES "components"("id") ON DELETE CASCADE,
    "requests_cpu" varchar,
    "requests_memory" varchar,
    "limits_cpu" varchar,
    "limits_memory" varchar
);

CREATE TABLE "env_vars" (
    "id" bigserial PRIMARY KEY,
    "component_id" bigint NOT NULL REFERENCES "components"("id") ON DELETE CASCADE,
    "key" varchar NOT NULL,
    "value" varchar NOT NULL
);
