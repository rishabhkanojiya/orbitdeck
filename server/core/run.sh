#!/bin/sh

export DB_DRIVER=postgres
export DB_CONN=postgresql://root:root@localhost:5432/core?sslmode=disable
export SERVER_ADDRESS=localhost
export SERVER_PORT=8081
export TOKEN_SYMMETRIC_KEY=6d2e4c40-c5f6-4b95-84d6-6f5a4554
export ACCESS_TOKEN_DURATION=15m
export REFRESH_TOKEN_DURATION=24h
export REDIS_ADDRESS=0.0.0.0:6379
export MIGRATION_URL=file://db/migration
export EMAIL_SENDER_NAME=Nikki Parker
export EMAIL_SENDER_ADDRESS=nikki96@ethereal.email
export EMAIL_SENDER_PASSWORD=vyPM1PtxuRee7MGZZe

if [ "$1" = "server" ]; then
    echo "Running Server 🚀"
    export MODE="server"
elif [ "$1" = "generate" ]; then
    echo "Running Helm Generator Worker 🚀"
    export MODE="worker"
    export WORKER_TYPE="generate-helm"
elif [ "$1" = "uninstall" ]; then
    echo "Running Helm uninstaller Worker 🚀"
    export MODE="worker"
    export WORKER_TYPE="uninstall-helm"
else
    # Default to server if no valid argument is given
    echo "Running Server (default mode) 🚀"
    export MODE="server"
fi

go run main.go
