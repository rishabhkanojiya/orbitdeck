#!/bin/sh

export AUTH_API_URL=http://localhost:9069
export CORE_API_URL=http://localhost:8081
export ANALYTICS_API_URL=http://localhost:8090

node server.js
