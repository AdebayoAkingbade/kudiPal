#!/usr/bin/env bash
set -euo pipefail

STACK_NAME="${STACK_NAME:-kudipal-prod}"
REGION="${AWS_REGION:-eu-west-1}"
TEMPLATE="${TEMPLATE:-infra/aws/ecs-fargate-cloudformation.yml}"

aws cloudformation deploy \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --template-file "$TEMPLATE" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides "$@"
