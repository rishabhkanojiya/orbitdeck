# Build stage
FROM golang:1.23.3-alpine3.19 AS builder
RUN apk add --no-cache git
RUN git config --global url."https://<TOKEN>@github.com/rishabhkanojiya/orbitdeck".insteadOf "https://github.com/rishabhkanojiya/orbitdeck"
WORKDIR /app
COPY . .
RUN go env -w GOPRIVATE=github.com/rishabhkanojiya/orbitdec
RUN go build -o main main.go

# Run stage
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/main .
COPY .env .
COPY start.sh .
COPY db/migration ./db/migration

EXPOSE 8081
CMD [ "/app/main" ]
ENTRYPOINT [ "/app/start.sh" ]
