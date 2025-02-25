package service

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"time"

	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"
	"github.com/rs/zerolog/log"
	"gopkg.in/yaml.v3"
)

type HelmDeployer interface {
	Deploy(deployment db.DeploymentParams) error
}

type HelmService struct {
	chartPath   string
	helmTimeout time.Duration
}

func NewHelmService(chartPath string) *HelmService {
	return &HelmService{
		chartPath:   chartPath,
		helmTimeout: 5 * time.Minute,
	}
}

func (s *HelmService) Deploy(deployment db.DeploymentParams) error {

	values, err := s.generateValues(deployment)
	if err != nil {
		return fmt.Errorf("failed to generate Helm values: %w", err)
	}

	valuesPath, err := s.createValuesFile(values)
	if err != nil {
		return fmt.Errorf("failed to create values file: %w", err)
	}
	defer os.Remove(valuesPath)

	args := []string{
		"upgrade", "--install",
		deployment.HelmRelease,
		s.chartPath,
		"-f", valuesPath,
		"-n", "orbit",
		"--create-namespace",
		"--wait",
		"--timeout", s.helmTimeout.String(),
		// "--dry-run",
	}
	// args := []string{
	// 	"uninstall",
	// 	deployment.HelmRelease,
	// 	"--dry-run",
	// }

	ctx, cancel := context.WithTimeout(context.Background(), s.helmTimeout)
	defer cancel()

	cmd := exec.CommandContext(ctx, "helm", args...)

	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Error().Err(err).Int64("id", deployment.ID).Msg("Helm command failed")
		return err
	}

	log.Info().Str("Release", deployment.HelmRelease).
		Str("output", string(output)).Msg("Helm deployment successful")
	return nil
}

func (s *HelmService) generateValues(deployment db.DeploymentParams) (map[string]interface{}, error) {
	components := make([]map[string]interface{}, 0, len(deployment.Components))

	for _, comp := range deployment.Components {
		componentValues := map[string]interface{}{
			"name":         comp.Name,
			"replicaCount": comp.ReplicaCount,
			"image": map[string]string{
				"repository": comp.Image.Repository,
				"tag":        comp.Image.Tag,
			},
			"resources": map[string]interface{}{
				"requests": map[string]string{
					"cpu":    comp.Resources.Requests.CPU,
					"memory": comp.Resources.Requests.Memory,
				},
				"limits": map[string]string{
					"cpu":    comp.Resources.Limits.CPU,
					"memory": comp.Resources.Limits.Memory,
				},
			},
			"service": map[string]interface{}{
				"port": comp.ServicePort,
			},
			"env": comp.Env,
		}

		components = append(components, componentValues)
	}

	return map[string]interface{}{
		"components": components,
		// "environment": deployment.Environment,
	}, nil
}

func (s *HelmService) createValuesFile(values map[string]interface{}) (string, error) {
	data, err := yaml.Marshal(values)
	if err != nil {
		return "", fmt.Errorf("failed to marshal values: %w", err)
	}

	tmpFile, err := os.CreateTemp("", "helm-values-*.yaml")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer tmpFile.Close()

	if _, err := tmpFile.Write(data); err != nil {
		return "", fmt.Errorf("failed to write values file: %w", err)
	}

	return tmpFile.Name(), nil
}

func (s *HelmService) VerifyHelmInstallation() error {
	cmd := exec.Command("helm", "version")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("helm not installed or not working properly: %w\n%s", err, string(output))
	}

	log.Info().
		Str("Helm version: ", string(output)).Msg("Helm Verified successful")

	return nil
}
