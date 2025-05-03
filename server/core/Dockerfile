# Build stage
FROM golang:1.23.3-alpine3.19 AS builder
RUN apk add --no-cache git
RUN git config --global url."https://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@github.com/rishabhkanojiya/orbitdeck".insteadOf "https://github.com/rishabhkanojiya/orbitdeck"
WORKDIR /app
COPY . .
RUN go env -w GOPRIVATE=github.com/rishabhkanojiya/orbitdec
RUN go build -o main main.go

# Run stage
FROM alpine:3.19
WORKDIR /app
RUN apk add curl openssl bash --no-cache
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x ./kubectl && \
    mv ./kubectl /usr/local/bin/kubectl && \
    curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 && \
    chmod +x get_helm.sh && ./get_helm.sh
COPY --from=builder /app/main .
COPY config ./config/
COPY .env .
COPY start.sh .
COPY db/migration ./db/migration

EXPOSE 9069
ENTRYPOINT ["/app/main" ]
