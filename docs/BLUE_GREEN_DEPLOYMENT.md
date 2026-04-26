# Blue-Green Deployment Strategy

omni-stellar-omni-stellar-scavenger uses blue-green deployment for zero-downtime updates with automatic rollback on failure.

## Architecture

- **Blue**: Current production deployment (active)
- **Green**: New deployment (standby)
- **Service**: Load balancer that switches between blue and green
- **Health Checks**: Automated smoke tests before traffic switch

## Deployment Flow

1. **Update Green**: Deploy new image to green deployment
2. **Scale Up**: Scale green to match blue replicas
3. **Wait Ready**: Wait for all green pods to be ready
4. **Smoke Tests**: Run automated tests against green
5. **Switch Traffic**: Update service selector to point to green
6. **Monitor**: Watch for errors in green deployment
7. **Scale Down**: Scale blue to zero (keep for quick rollback)

## Manual Deployment

```bash
./scripts/blue-green-deploy.sh omni-stellar-scavenger:v1.2.3
```

## Automated Deployment

Trigger via GitHub Actions with image tag and environment.

## Health Checks

Green deployment must pass liveness and readiness probes plus smoke tests.

## Rollback

Automatic rollback on smoke test failures or high error rates.

Manual rollback:
```bash
kubectl patch service omni-stellar-scavenger \
  -n omni-stellar-scavenger-prod \
  -p '{"spec":{"selector":{"slot":"blue"}}}'
```

## Monitoring

```bash
kubectl rollout status deployment/omni-stellar-scavenger-green -n omni-stellar-scavenger-prod
kubectl logs -f -l app=omni-stellar-scavenger,slot=green -n omni-stellar-scavenger-prod
```
