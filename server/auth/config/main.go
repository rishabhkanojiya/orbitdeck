package config

import (
	"strings"
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
	setDefaults()

	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	bindEnvironmentVariables()

	err = viper.Unmarshal(&config)
	if err != nil {
		return config, err
	}

	return config, nil
}

func bindEnvironmentVariables() {
	// Explicitly bind each environment variable to its corresponding field
	viper.BindEnv("DB_DRIVER")
	viper.BindEnv("DB_CONN")
	viper.BindEnv("SERVER_ADDRESS")
	viper.BindEnv("SERVER_PORT")
	viper.BindEnv("MODE")
	viper.BindEnv("WORKER_TYPE")
	viper.BindEnv("TOKEN_SYMMETRIC_KEY")
	viper.BindEnv("ACCESS_TOKEN_DURATION")
	viper.BindEnv("REFRESH_TOKEN_DURATION")
	viper.BindEnv("REDIS_ADDRESS")
	viper.BindEnv("MIGRATION_URL")
	viper.BindEnv("EMAIL_SENDER_NAME")
	viper.BindEnv("EMAIL_SENDER_ADDRESS")
	viper.BindEnv("EMAIL_SENDER_PASSWORD")
}

func setDefaults() {
	viper.SetDefault("DB_DRIVER", "postgres")
	viper.SetDefault("SERVER_ADDRESS", "0.0.0.0")
	viper.SetDefault("SERVER_PORT", 8080)
	viper.SetDefault("MODE", "development")
	viper.SetDefault("WORKER_TYPE", "api")
	viper.SetDefault("ACCESS_TOKEN_DURATION", time.Hour*24)
	viper.SetDefault("REFRESH_TOKEN_DURATION", time.Hour*24*7)
}

func maskSensitiveInfo(config Config) Config {
	maskedConfig := config
	if config.TOKEN_SYMMETRIC_KEY != "" {
		maskedConfig.TOKEN_SYMMETRIC_KEY = "[REDACTED]"
	}
	if config.DB_CONN != "" {
		maskedConfig.DB_CONN = "[REDACTED]"
	}
	if config.EMAIL_SENDER_PASSWORD != "" {
		maskedConfig.EMAIL_SENDER_PASSWORD = "[REDACTED]"
	}
	return maskedConfig
}
