# Using a Private GitHub Repository as a Go Module

This guide explains how to use a private GitHub repository as a dependency in another Go module. It includes instructions for local development and Docker-based workflows.

## Local Setup

Follow these steps to access a private Go module:

### 1. Generate a GitHub Personal Access Token

1. Go to **GitHub** :
   - Navigate to `Settings` → `Developer Settings` → `Personal Access Tokens` → `Fine-grained Token`.
2. Select the repository you want to access.
3. Under **Repository Permissions** , grant the following:
   - **Contents** : Read-only
   - **Metadata** : Read-only
4. Generate the token and copy it.

### 2. Configure GOPRIVATE

Set the private module's URL as a trusted source for Go tools. For example, to use the private repository `rishabhkanojiya/orbitdeck`, run:

```bash
go env -w GOPRIVATE=github.com/rishabhkanojiya/orbitdeck
```

### 3. Update Git Configuration

Replace `<TOKEN>` with your personal access token in the following command:

```bash
git config --global url."https://<TOKEN>@github.com/rishabhkanojiya/orbitdeck".insteadOf "https://github.com/rishabhkanojiya/orbitdeck"
```

### 4. Test the Setup

Verify the setup by running:

```bash
go get github.com/rishabhkanojiya/orbitdeck
```

---

## Docker Setup

To use a private Go module in a Dockerized project, update the `Dockerfile` as follows:

```Dockerfile
# Build stage
FROM golang:1.23.3-alpine3.19 AS builder

# Install Git
RUN apk add --no-cache git

# Configure Git for private repository access
RUN git config --global url."https://<TOKEN>@github.com/rishabhkanojiya/orbitdeck".insteadOf "https://github.com/rishabhkanojiya/orbitdeck"

# Set GOPRIVATE environment variable
RUN go env -w GOPRIVATE=github.com/rishabhkanojiya/orbitdeck

# Set working directory
WORKDIR /app

# Copy source code and build
COPY . .
RUN go build -o main main.go
```

### Notes

- Replace `<TOKEN>` in the `RUN git config` command with your personal access token.
- Use `GOPRIVATE` to prevent Go from accessing the public proxy for private repositories.

---

By following these steps, you can securely use private GitHub repositories as Go modules in both local and Docker environments.
