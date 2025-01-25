package db

import (
	"database/sql"
	"log"
	"os"
	"simple_bank/config"
	"testing"

	_ "github.com/lib/pq"
)

var testQueries *Queries
var testDB *sql.DB

func TestMain(m *testing.M) {

	configs, err := config.LoadConfig("../..", ".dev")

	if err != nil {
		log.Fatal("cannot read env:", err)

	}

	testDB, err = sql.Open(configs.DB_DRIVER, configs.DB_CONN)
	if err != nil {
		log.Fatal("cannot connect to db:", err)
	}

	testQueries = New(testDB)

	os.Exit(m.Run())
}
