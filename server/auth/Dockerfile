# Build stage
FROM golang:1.23.3-alpine3.19 AS builder
WORKDIR /app
COPY . .
RUN go build -o main main.go

# Run stage
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/main .
COPY .env .
COPY start.sh .
COPY db/migration ./db/migration

EXPOSE 9069
ENTRYPOINT ["/app/main" ]
