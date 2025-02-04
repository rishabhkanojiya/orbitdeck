package db

import (
	"context"
	"database/sql"
)

type CreateDeploymentTxParams struct {
	Name        string
	Environment string
	Components  []ComponentTxParams
}

type ComponentTxParams struct {
	Name         string
	Image        ImageParams
	ReplicaCount int32
	ServicePort  int32
	Resources    ResourcesParams
	Env          []EnvVarParam
}

type ImageParams struct {
	Repository string
	Tag        string
}

type ResourcesParams struct {
	Requests struct {
		CPU    string
		Memory string
	}
	Limits struct {
		CPU    string
		Memory string
	}
}

type EnvVarParam struct {
	Key   string
	Value string
}

func (store *SQLStore) CreateDeploymentTx(ctx context.Context, params CreateDeploymentTxParams) (Deployment, error) {
	var deployment Deployment

	err := store.execTx(ctx, func(q *Queries) error {
		// Create deployment
		d, err := q.CreateDeployment(ctx, CreateDeploymentParams{
			Name:        params.Name,
			Environment: Environment(params.Environment),                                                               // Convert string to ENUM type
			HelmRelease: sql.NullString{String: generateHelmReleaseName(params.Name, params.Environment), Valid: true}, // Convert string to sql.NullString
		})
		if err != nil {
			return err
		}

		// Create components
		for _, comp := range params.Components {
			// Create component
			c, err := q.CreateComponent(ctx, CreateComponentParams{
				DeploymentID: d.ID,
				Name:         comp.Name,
				ReplicaCount: comp.ReplicaCount,
				ServicePort:  sql.NullInt32{Int32: comp.ServicePort, Valid: true},
			})
			if err != nil {
				return err
			}

			// Create image
			_, err = q.CreateImage(ctx, CreateImageParams{
				ComponentID: c.ID,
				Repository:  comp.Image.Repository,
				Tag:         comp.Image.Tag,
			})
			if err != nil {
				return err
			}

			// Create resources
			_, err = q.CreateResources(ctx, CreateResourcesParams{
				ComponentID:    c.ID,
				RequestsCpu:    sql.NullString{String: comp.Resources.Requests.CPU, Valid: comp.Resources.Requests.CPU != ""},
				RequestsMemory: sql.NullString{String: comp.Resources.Requests.Memory, Valid: comp.Resources.Requests.Memory != ""},
				LimitsCpu:      sql.NullString{String: comp.Resources.Limits.CPU, Valid: comp.Resources.Limits.CPU != ""},
				LimitsMemory:   sql.NullString{String: comp.Resources.Limits.Memory, Valid: comp.Resources.Limits.Memory != ""},
			})
			if err != nil {
				return err
			}

			// Create environment variables
			for _, env := range comp.Env {
				_, err = q.CreateEnvVar(ctx, CreateEnvVarParams{
					ComponentID: c.ID,
					Key:         env.Key,
					Value:       env.Value,
				})
				if err != nil {
					return err
				}
			}
		}

		deployment = d
		return nil
	})

	return deployment, err
}

func generateHelmReleaseName(name, env string) string {
	return "orbit-" + name + "-" + env
}
