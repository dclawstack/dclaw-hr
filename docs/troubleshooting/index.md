# Troubleshooting

Common issues and solutions for DClaw HR.

## Quick Diagnostics

```bash
# Check app pods
kubectl get pods -n dclaw-hr

# Check logs
kubectl logs -n dclaw-hr deployment/dclaw-hr-backend

# Check database
kubectl get clusters -n dclaw-hr
```

## Sections

- [Common Issues](./common-issues)
- [FAQ](./faq)
