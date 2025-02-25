CREATE TABLE "ingresses" (
    "id" bigserial PRIMARY KEY,
    "deployment_id" bigint NOT NULL REFERENCES "deployments"("id") ON DELETE CASCADE,
    "host" varchar NOT NULL,
    "path" varchar NOT NULL DEFAULT '/',
    "service_port" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now()
);
