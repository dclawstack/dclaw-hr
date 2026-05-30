#!/bin/bash
set -e
echo "Running Alembic migrations..."
alembic upgrade head
echo "Starting uvicorn..."
exec uvicorn app.api.main:app --host 0.0.0.0 --port "${PORT:-8097}"
