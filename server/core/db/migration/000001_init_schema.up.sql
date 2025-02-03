CREATE TABLE "cores" (
  "id" bigserial PRIMARY KEY,
  "owner" varchar NOT NULL,
  "balance" bigint NOT NULL,
  "currency" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);


CREATE INDEX ON "cores" ("owner");

ALTER TABLE "cores" ADD CONSTRAINT "owner_currency_key" UNIQUE ("owner", "currency");
