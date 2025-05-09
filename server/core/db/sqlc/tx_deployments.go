package db

import (
	"context"
	"database/sql"
	"fmt"
)

type DeploymentParams struct {
	ID          int64
	Owner       string
	Name        string
	Environment string
	HelmRelease string
	TaskId      string
	Status      string
	Components  []ComponentParams
	Ingress     []IngressParams // Add ingress support
	CreatedAt   sql.NullTime
}

type IngressParams struct {
	Host        string
	Path        string
	ServiceName string
	ServicePort int32
}

type ComponentParams struct {
	ID           int64
	DeploymentID int64
	Name         string
	ReplicaCount int32
	ServicePort  int32
	Image        ImageParams
	Resources    ResourcesParams
	Env          []GetComponentEnvVarsRow
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

func (store *SQLStore) CreateDeploymentTx(ctx context.Context, params DeploymentParams, AfterCreate func(id int64) (string, error)) (Deployment, error) {
	var deployment Deployment

	err := store.execTx(ctx, func(q *Queries) error {

		d, err := q.CreateDeployment(ctx, CreateDeploymentParams{
			Name:        params.Name,
			Owner:       params.Owner,
			Environment: Environment(params.Environment),
			HelmRelease: sql.NullString{String: generateHelmReleaseName(params.Name, params.Environment), Valid: true},
		})

		if err != nil {
			return err
		}

		for _, comp := range params.Components {
			c, err := q.CreateComponent(ctx, CreateComponentParams{
				DeploymentID: d.ID,
				Name:         comp.Name,
				ReplicaCount: comp.ReplicaCount,
				ServicePort:  sql.NullInt32{Int32: comp.ServicePort, Valid: true},
			})
			if err != nil {
				return err
			}

			_, err = q.CreateImage(ctx, CreateImageParams{
				ComponentID: c.ID,
				Repository:  comp.Image.Repository,
				Tag:         comp.Image.Tag,
			})
			if err != nil {
				return err
			}

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

		// Create ingress rules
		for _, ingress := range params.Ingress {
			_, err := q.CreateIngress(ctx, CreateIngressParams{
				DeploymentID: d.ID,
				Host:         ingress.Host,
				Path:         ingress.Path,
				ServicePort:  ingress.ServicePort,
				ServiceName:  ingress.ServiceName,
			})
			if err != nil {
				return err
			}
		}

		deployment = d
		var taskId string
		taskId, err = AfterCreate(d.ID)
		if err != nil {
			return err
		}

		if taskId != "" {
			err = q.UpdateDeploymentTaskID(ctx, UpdateDeploymentTaskIDParams{
				ID:     d.ID,
				TaskID: sql.NullString{String: taskId, Valid: true},
			})
			if err != nil {
				return fmt.Errorf("failed to update deployment with task ID: %w", err)
			}
		}

		return nil
	})

	return deployment, err
}

func (store *SQLStore) GetDeploymentObject(ctx context.Context, id int64) (DeploymentParams, error) {

	deployment, err := store.Queries.GetDeployment(ctx, id)
	if err != nil {
		return DeploymentParams{}, fmt.Errorf("failed to get deployment: %w", err)
	}

	components, err := store.Queries.GetDeploymentComponents(ctx, id)
	if err != nil {
		return DeploymentParams{}, fmt.Errorf("failed to get components: %w", err)
	}

	ingressRules, err := store.Queries.GetIngressByDeployment(ctx, id)
	if err != nil {
		return DeploymentParams{}, fmt.Errorf("failed to get ingress rules: %w", err)
	}

	var compParams []ComponentParams
	for _, comp := range components {
		envVars, err := store.Queries.GetComponentEnvVars(ctx, comp.ID)
		if err != nil {
			return DeploymentParams{}, fmt.Errorf("failed to get env vars: %w", err)
		}

		compParams = append(compParams, ComponentParams{
			ID:           comp.ID,
			Name:         comp.Name,
			ReplicaCount: comp.ReplicaCount,
			ServicePort:  comp.ServicePort.Int32,
			Image: ImageParams{
				Repository: comp.Repository.String,
				Tag:        comp.Tag.String,
			},
			Resources: ResourcesParams{
				Requests: struct {
					CPU    string
					Memory string
				}{
					CPU:    comp.RequestsCpu.String,
					Memory: comp.RequestsMemory.String,
				},
				Limits: struct {
					CPU    string
					Memory string
				}{
					CPU:    comp.LimitsCpu.String,
					Memory: comp.LimitsMemory.String,
				},
			},
			Env: envVars,
		})
	}

	var ingressParams []IngressParams
	for _, ingress := range ingressRules {
		ingressParams = append(ingressParams, IngressParams{
			Host:        ingress.Host,
			Path:        ingress.Path,
			ServicePort: ingress.ServicePort,
			ServiceName: ingress.ServiceName,
		})
	}

	return DeploymentParams{
		ID:          deployment.ID,
		Owner:       deployment.Owner,
		Name:        deployment.Name,
		Environment: string(deployment.Environment),
		HelmRelease: deployment.HelmRelease.String,
		TaskId:      deployment.TaskID.String,
		Status:      deployment.Status.String,
		CreatedAt:   sql.NullTime{Time: deployment.CreatedAt, Valid: true},
		Components:  compParams,
		Ingress:     ingressParams,
	}, nil
}

func generateHelmReleaseName(name, env string) string {
	return "orbit-" + name + "-" + env
}

type PaginatedDeploymentsResult struct {
	Results []DeploymentParams
	Total   int64
}

func (store *SQLStore) GetPaginatedDeploymentObjects(ctx context.Context, owner string, limit, offset int32) (PaginatedDeploymentsResult, error) {
	deployments, err := store.Queries.ListDeploymentsByOwnerPaginated(ctx, ListDeploymentsByOwnerPaginatedParams{
		Owner:  owner,
		Limit:  limit,
		Offset: offset,
	})

	if err != nil {
		return PaginatedDeploymentsResult{}, fmt.Errorf("failed to list deployments: %w", err)
	}

	total, err := store.Queries.CountDeployments(ctx)
	if err != nil {
		return PaginatedDeploymentsResult{}, fmt.Errorf("failed to count deployments: %w", err)
	}

	var allDeployments []DeploymentParams
	for _, deployment := range deployments {
		fullDeployment, err := store.GetDeploymentObject(ctx, deployment.ID)
		if err != nil {
			return PaginatedDeploymentsResult{}, fmt.Errorf("failed to get deployment object for ID %d: %w", deployment.ID, err)
		}
		allDeployments = append(allDeployments, fullDeployment)
	}

	return PaginatedDeploymentsResult{
		Results: allDeployments,
		Total:   total,
	}, nil
}

func (store *SQLStore) DeleteDeployment(ctx context.Context, id int64) error {
	return store.Queries.DeleteDeploymentCascade(ctx, id)
}
