## OrbitDeck

## Requirements

Ensure you have the necessary dependencies installed for development.

### Packages Required for Development

- Install the required [migration](https://github.com/golang-migrate/migrate) package using the following command:
  ```bash
  go get -u github.com/golang-migrate/migrate/v4
  ```
- Install [sqlc](https://github.com/kyleconroy/sqlc) for generating type-safe database queries:
  ```bash
  go install github.com/kyleconroy/sqlc/cmd/sqlc@latest
  ```

## Installing Dependencies on Windows

For `sqlc`, follow the same steps:

1. Download `sqlc` from [here](https://github.com/kyleconroy/sqlc/releases).
2. Extract the binary and move it to `C:\sqlc`.
3. Add `C:\sqlc` to the system `Path` environment variable following the steps above.
4. Verify installation by running:
   ````bash
   sqlc version```
   ````

## Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Run database migrations:
   ```bash
   migrate -path <migrations_folder> -database <database_url> up
   ```
