# KudiPal Deployment

## Local

```bash
docker compose up --build
```

The backend listens on `http://localhost:8081`. OpenAPI is available at `/swagger-ui.html` and raw docs at `/v3/api-docs`.

## Required Secrets

- `DATABASE_PASSWORD`
- `JWT_JWK_SET_URI`
- `JWT_ISSUER_URI`
- `WHATSAPP_CLOUD_ACCESS_TOKEN`
- `WHATSAPP_CLOUD_PHONE_NUMBER_ID`
- `WHATSAPP_CLOUD_VERIFY_TOKEN`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_CALLBACK_URL`
- `OPENAI_API_KEY`
- `PII_ENCRYPTION_KEY`

## AWS

Build and push the backend image to ECR, then deploy:

```bash
aws cloudformation deploy \
  --stack-name kudipal-prod \
  --region eu-west-1 \
  --template-file infra/aws/ecs-fargate-cloudformation.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    EnvironmentName=prod \
    ContainerImage=<account>.dkr.ecr.eu-west-1.amazonaws.com/kudipal-backend:<tag> \
    VpcId=<vpc-id> \
    PrivateSubnets=<subnet-a>,<subnet-b> \
    PublicSubnets=<subnet-a>,<subnet-b> \
    CertificateArn=<acm-cert-arn> \
    DatabasePassword=<generated-password>
```

After deployment, replace placeholder values in `kudipal/prod/app` in AWS Secrets Manager and restart the ECS service.
