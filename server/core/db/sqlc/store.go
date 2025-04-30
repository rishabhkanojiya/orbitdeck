package db

import (
	"context"
	"database/sql"
	"fmt"
)

type Store interface {
	Querier
	CreateDeploymentTx(ctx context.Context, params DeploymentParams, AfterCreate func(id int64) (string, error)) (Deployment, error)
	GetDeploymentObject(ctx context.Context, id int64) (DeploymentParams, error)
	GetPaginatedDeploymentObjects(ctx context.Context, limit, offset int32) (PaginatedDeploymentsResult, error)
	DeleteDeployment(ctx context.Context, id int64) error
	SetDeploymentStatus(ctx context.Context, id int64, status string) error
}

// Store provides all functions to execute db queries and transaction
type SQLStore struct {
	db *sql.DB
	*Queries
}

// NewStore creates a new store
func NewStore(db *sql.DB) Store {
	return &SQLStore{
		db:      db,
		Queries: New(db),
	}
}

// ExecTx executes a function within a database transaction
func (store *SQLStore) execTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := store.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	q := New(tx)
	err = fn(q)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit()
}

func (store *SQLStore) SetDeploymentStatus(ctx context.Context, id int64, status string) error {
	return store.Queries.UpdateDeploymentStatus(ctx, UpdateDeploymentStatusParams{
		ID:     id,
		Status: sql.NullString{String: status, Valid: true},
	})
}
