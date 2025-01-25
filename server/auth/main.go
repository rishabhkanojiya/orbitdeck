package main

import (
	"database/sql"
	"fmt"

	"github.com/rishabhkanojiya/orbitdeck/server/auth/api"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/config"
	db "github.com/rishabhkanojiya/orbitdeck/server/auth/db/sqlc"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/mail"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/worker"

	"github.com/hibiken/asynq"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog/log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	configs, err := config.LoadConfig(".", ".env")
	if err != nil {
		log.Fatal().Err(err).Msg("cannot load config")
	}
	conn, err := sql.Open(configs.DB_DRIVER, configs.DB_CONN)
	if err != nil {
		log.Fatal().Err(err).Msg("cannot connect to db")
	}

	runDBMigration(configs.MIGRATION_URL, configs.DB_CONN)

	store := db.NewStore(conn)

	redisOpt := asynq.RedisClientOpt{
		Addr: configs.REDIS_ADDRESS,
	}

	taskDistributor := worker.NewRedisTaskDistributor(redisOpt)

	go runTaskProcessor(configs, redisOpt, store)

	runGinServer(configs, store, taskDistributor)
}

func runDBMigration(migrationURL string, dbSource string) {
	migration, err := migrate.New(migrationURL, dbSource)
	if err != nil {
		log.Fatal().Err(err).Msg("cannot create new migrate instance")
	}

	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal().Err(err).Msg("failed to run migrate up")
	}

	log.Info().Msg("db migrated successfully")
}

func runTaskProcessor(config config.Config, redisOpt asynq.RedisClientOpt, store db.Store) {
	mailer := mail.NewGmailSender(config.EMAIL_SENDER_NAME, config.EMAIL_SENDER_ADDRESS, config.EMAIL_SENDER_PASSWORD)
	taskProcessor := worker.NewRedisTaskProcessor(redisOpt, store, mailer)
	log.Info().Msg("start task processor")
	err := taskProcessor.Start()
	if err != nil {
		log.Fatal().Err(err).Msg("failed to start task processor")
	}
}

func runGinServer(config config.Config, store db.Store, taskDistributor worker.TaskDistributor) {
	server, err := api.NewServer(config, store, taskDistributor)
	if err != nil {
		log.Fatal().Err(err).Msg("cannot create server")
	}

	err = server.Start(fmt.Sprintf("%s:%d", config.SERVER_ADDRESS, config.SERVER_PORT))

	if err != nil {
		log.Fatal().Err(err).Msg("cannot start server")
	}
}
