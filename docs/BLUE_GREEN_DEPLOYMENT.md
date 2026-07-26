# Blue-Green Deployment Strategy

omni-stellar-omni-stellar-scavenger uses blue-green deployment for zero-downtime updates with automatic rollback on failure.

## Architecture

- **Blue**: Current production deployment (active)
- **Green**: New deployment (standby)
- **Service**: `omni-stellar-scavenger` LoadBalancer switching between blue and green via `slot` label selector
- **Manifests**: `k8s/blue-green-deployment.yaml`

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/blue-green-deploy.sh` | Full deployment pipeline with auto-rollback |
| `scripts/monitor-deployment.sh` | Standalone deployment health monitor |

## Deployment Flow

1. **Update Green**: Set new image on the green Deployment
2. **Scale Up**: Scale green to match current blue replica count
3. **Wait Ready**: `kubectl rollout status` until all green pods pass readiness probes
4. **Smoke Tests**: Poll `/health` via a curl pod (up to 30 attempts × 10s)
5. **Switch Traffic**: Patch service selector from `slot: blue` → `slot: green`
6. **Stabilize**: Wait 15s for in-flight connections to drain
7. **Monitor**: Run `monitor-deployment.sh` for 120s (configurable via `MONITOR_DURATION`)
8. **Scale Down Blue**: Scale blue to 0 replicas; keep for instant rollback

## Usage

### Manual Deployment
```bash
./scripts/blue-green-deploy.sh omni-stellar-scavenger:v1.2.3
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NAMESPACE` | `omni-stellar-scavenger-prod` | Target namespace |
| `SMOKE_TEST_URL` | `http://localhost/health` | URL for smoke tests |
| `MONITOR_DURATION` | `120` | Seconds to monitor after traffic switch |
| `ERROR_THRESHOLD` | `10` | Max errors in tail-100 logs before rollback |

### Automated Deployment
Trigger via GitHub Actions by passing `IMAGE_TAG` and `ENVIRONMENT` inputs.

## Rollback

### Automatic Rollback
The deploy script traps errors via `trap rollback ERR`. Rollback is triggered when:
- Smoke tests fail after 30 attempts
- `monitor-deployment.sh` detects error count above threshold

### Manual Rollback (instant — blue already has 0 replicas but config is intact)
```bash
# Switch traffic back to blue
kubectl patch service omni-stellar-scavenger \
  -n omni-stellar-scavenger-prod \
  -p '{"spec":{"selector":{"slot":"blue"}}}'

# Restore blue replica count
kubectl scale deployment omni-stellar-scavenger-blue --replicas=3 -n omni-stellar-scavenger-prod
```

## Deployment Monitoring

### During Deployment
`monitor-deployment.sh` runs in-loop after traffic switch and reports:
- Pod readiness count
- Error count from recent logs
- Restart count
- CPU and memory averages (via Prometheus, if available)

```bash
# Monitor green slot for 3 minutes
NAMESPACE=omni-stellar-scavenger-prod DURATION=180 ./scripts/monitor-deployment.sh green
```

### After Deployment
```bash
# Check rollout status
kubectl rollout status deployment/omni-stellar-scavenger-green -n omni-stellar-scavenger-prod

# Tail live logs
kubectl logs -f -l app=omni-stellar-scavenger,slot=green -n omni-stellar-scavenger-prod

# Check active slot
kubectl get service omni-stellar-scavenger -n omni-stellar-scavenger-prod \
  -o jsonpath='{.spec.selector.slot}'
```

## HPA Behavior During Blue-Green

The `omni-stellar-scavenger-hpa` targets `omni-stellar-scavenger-blue` by default. After a successful deployment where green becomes active, update the HPA target:

```bash
kubectl patch hpa omni-stellar-scavenger-hpa -n omni-stellar-scavenger-prod \
  -p '{"spec":{"scaleTargetRef":{"name":"omni-stellar-scavenger-green"}}}'
```
