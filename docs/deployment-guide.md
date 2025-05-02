# Deployment Guide

This guide provides detailed instructions for deploying the Credit Cooperative System to various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring and Logging](#monitoring-and-logging)
6. [Backup and Recovery](#backup-and-recovery)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the Credit Cooperative System, ensure you have the following:

### System Requirements

- Node.js 18.x or higher
- npm 8.x or higher
- PostgreSQL 14.x or higher
- Redis 6.x or higher (for caching and session management)
- Supabase account (for database and authentication)

### Access Requirements

- GitHub repository access
- Supabase project credentials
- Cloud provider credentials (AWS, Azure, or GCP)
- Domain name and DNS access

## Environment Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# App
NODE_ENV=production
PORT=3000

# API
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_WEBSOCKET_URL=wss://api.example.com/ws

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h

# Email
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@example.com

# Logging
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

### Database Setup

1. Create a new Supabase project.
2. Run the database migration scripts:

```bash
npm run db:migrate
```

3. Seed the database with initial data:

```bash
npm run db:seed
```

## Deployment Options

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t credit-cooperative-system:latest .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env credit-cooperative-system:latest
```

### Vercel Deployment

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel --prod
```

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. Install the AWS CLI and EB CLI:

```bash
pip install awscli
pip install awsebcli
```

2. Configure AWS credentials:

```bash
aws configure
```

3. Initialize EB application:

```bash
eb init
```

4. Create an environment:

```bash
eb create production
```

5. Deploy the application:

```bash
eb deploy
```

#### Using AWS ECS

1. Create an ECR repository:

```bash
aws ecr create-repository --repository-name credit-cooperative-system
```

2. Build and push the Docker image:

```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
docker build -t <aws-account-id>.dkr.ecr.<region>.amazonaws.com/credit-cooperative-system:latest .
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/credit-cooperative-system:latest
```

3. Create an ECS cluster, task definition, and service using the AWS console or CLI.

### Azure Deployment

#### Using Azure App Service

1. Install the Azure CLI:

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

2. Login to Azure:

```bash
az login
```

3. Create a resource group:

```bash
az group create --name credit-cooperative-system --location eastus
```

4. Create an App Service plan:

```bash
az appservice plan create --name credit-cooperative-system-plan --resource-group credit-cooperative-system --sku B1 --is-linux
```

5. Create a web app:

```bash
az webapp create --name credit-cooperative-system --resource-group credit-cooperative-system --plan credit-cooperative-system-plan --runtime "NODE|18-lts"
```

6. Configure environment variables:

```bash
az webapp config appsettings set --name credit-cooperative-system --resource-group credit-cooperative-system --settings @env.json
```

7. Deploy the application:

```bash
az webapp deployment source config-zip --name credit-cooperative-system --resource-group credit-cooperative-system --src dist.zip
```

## CI/CD Pipeline

The Credit Cooperative System uses GitHub Actions for continuous integration and deployment.

### GitHub Actions Workflow

The workflow is defined in `.github/workflows/ci.yml` and includes the following stages:

1. **Build and Test**: Builds the application and runs tests.
2. **Deploy to Staging**: Deploys the application to the staging environment when changes are pushed to the `develop` branch.
3. **Deploy to Production**: Deploys the application to the production environment when changes are pushed to the `main` branch.

### Setting Up GitHub Secrets

To use the CI/CD pipeline, set up the following secrets in your GitHub repository:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID (if using AWS)
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key (if using AWS)
- `AZURE_CREDENTIALS`: Your Azure credentials (if using Azure)

### Manual Deployment

If you need to deploy manually, follow these steps:

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Monitoring and Logging

### Logging

The Credit Cooperative System uses a structured logging system that outputs logs in JSON format. Logs are sent to:

- Console (in development)
- Log files (in production)
- Sentry (for error tracking)

To configure logging, set the following environment variables:

- `LOG_LEVEL`: The minimum log level to output (debug, info, warn, error)
- `SENTRY_DSN`: Your Sentry DSN for error tracking

### Monitoring

#### Health Checks

The application exposes a health check endpoint at `/api/health` that returns the status of the application and its dependencies.

To check the health of the application:

```bash
curl https://api.example.com/api/health
```

#### Metrics

The application exposes metrics at `/api/metrics` in Prometheus format. These metrics include:

- HTTP request count, duration, and status codes
- Database query count and duration
- Memory usage
- CPU usage

To view the metrics:

```bash
curl https://api.example.com/api/metrics
```

#### Alerting

Set up alerting using your preferred monitoring tool (e.g., Grafana, Datadog, New Relic) to be notified of issues with the application.

Common alerts to set up:

- High error rate
- High response time
- High CPU or memory usage
- Database connection issues
- Failed health checks

## Backup and Recovery

### Database Backups

Supabase automatically creates daily backups of your database. To create a manual backup:

1. Go to the Supabase dashboard.
2. Navigate to your project.
3. Go to the "Database" section.
4. Click on "Backups".
5. Click on "Create Backup".

### Restoring from Backup

To restore from a backup:

1. Go to the Supabase dashboard.
2. Navigate to your project.
3. Go to the "Database" section.
4. Click on "Backups".
5. Find the backup you want to restore.
6. Click on "Restore".

### Disaster Recovery

In case of a disaster, follow these steps to recover the application:

1. Restore the database from the latest backup.
2. Deploy the application to a new environment.
3. Update DNS records to point to the new environment.
4. Verify that the application is working correctly.

## Troubleshooting

### Common Issues

#### Application Won't Start

1. Check that all environment variables are set correctly.
2. Check that the database is accessible.
3. Check the logs for error messages.

#### Database Connection Issues

1. Verify that the database credentials are correct.
2. Check that the database is running.
3. Check that the database is accessible from the application server.

#### Deployment Failures

1. Check the CI/CD logs for error messages.
2. Verify that all required secrets are set.
3. Check that the build process completes successfully.

### Getting Help

If you encounter issues that you can't resolve, contact the development team:

- Email: dev@example.com
- Slack: #credit-cooperative-system
- GitHub: Open an issue in the repository
