package config

import (
	"fmt"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	DB_DRIVER              string        `mapstructure:"DB_DRIVER"`
	DB_CONN                string        `mapstructure:"DB_CONN"`
	SERVER_ADDRESS         string        `mapstructure:"SERVER_ADDRESS"`
	SERVER_PORT            int           `mapstructure:"SERVER_PORT"`
	MODE                   string        `mapstructure:"MODE"`
	WORKER_TYPE            string        `mapstructure:"WORKER_TYPE"`
	TOKEN_SYMMETRIC_KEY    string        `mapstructure:"TOKEN_SYMMETRIC_KEY"`
	ACCESS_TOKEN_DURATION  time.Duration `mapstructure:"ACCESS_TOKEN_DURATION"`
	REFRESH_TOKEN_DURATION time.Duration `mapstructure:"REFRESH_TOKEN_DURATION"`
	REDIS_ADDRESS          string        `mapstructure:"REDIS_ADDRESS"`
	MIGRATION_URL          string        `mapstructure:"MIGRATION_URL"`
	EMAIL_SENDER_NAME      string        `mapstructure:"EMAIL_SENDER_NAME"`
	EMAIL_SENDER_ADDRESS   string        `mapstructure:"EMAIL_SENDER_ADDRESS"`
	EMAIL_SENDER_PASSWORD  string        `mapstructure:"EMAIL_SENDER_PASSWORD"`
}

func LoadConfig(path string, name string) (config Config, err error) {
	// Initialize Viper
	v := viper.New()

	// Configure Viper to read environment variables
	v.AutomaticEnv()

	fmt.Println("Viper settings:")
	for _, key := range v.AllKeys() {
		fmt.Printf("%s: %s\n", key, v.Get(key))
	}

	// Unmarshal configuration into struct
	err = v.Unmarshal(&config)
	if err != nil {
		return config, err
	}

	return config, nil
}
