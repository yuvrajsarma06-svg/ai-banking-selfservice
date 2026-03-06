# Deployment Guide

## Deployment Options

This document covers deployment strategies for production environments.

## 1. Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (EKS, AKS, GKE, or on-premise)
- kubectl configured
- Helm 3+ (optional, for package management)
- Container registry (ECR, ACR, Docker Hub)

### Architecture

```
┌──────────────────────────────────────────────────────┐
│           Kubernetes Cluster                         │
├──────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐│
│  │         Ingress / Load Balancer                  ││
│  │  (TLS termination, routing)                      ││
│  └──────────────────────────────────────────────────┘│
│  ┌──────────┬──────────┬──────────┬───────────────┐ │
│  │ Namespace│ PODs     │ Services │ ConfigMaps    │ │
│  │          │          │          │ Secrets       │ │
│  └──────────┴──────────┴──────────┴───────────────┘ │
│  ┌──────────────────────────────────────────────────┐│
│  │    Persistent Volumes (for databases)            ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

### Deploy Steps

#### 1. Create Kubernetes Namespace

```bash
kubectl create namespace banking-ai
kubectl config set-context --current --namespace=banking-ai
```

#### 2. Create Secrets

```bash
kubectl create secret generic banking-secrets \
  --from-literal=db_password=<secure-password> \
  --from-literal=redis_password=<secure-password> \
  --from-literal=jwt_secret=<jwt-secret> \
  --from-literal=azure_openai_key=<key> \
  --from-literal=twilio_auth_token=<token>
```

#### 3. Create ConfigMap

```bash
kubectl create configmap banking-config \
  --from-env-file=.env
```

#### 4. Deploy Databases

```bash
# PostgreSQL
kubectl apply -f infrastructure/kubernetes/postgres-pvc.yaml
kubectl apply -f infrastructure/kubernetes/postgres-deployment.yaml

# Redis
kubectl apply -f infrastructure/kubernetes/redis-pvc.yaml
kubectl apply -f infrastructure/kubernetes/redis-deployment.yaml

# Elasticsearch
kubectl apply -f infrastructure/kubernetes/elasticsearch-pvc.yaml
kubectl apply -f infrastructure/kubernetes/elasticsearch-deployment.yaml
```

#### 5. Deploy Backend Services

```bash
# API Gateway
kubectl apply -f infrastructure/kubernetes/api-gateway-deployment.yaml

# Auth Service
kubectl apply -f infrastructure/kubernetes/auth-service-deployment.yaml

# Conversation Engine
kubectl apply -f infrastructure/kubernetes/conversation-engine-deployment.yaml

# Transaction Service
kubectl apply -f infrastructure/kubernetes/transaction-service-deployment.yaml

# Analytics Service
kubectl apply -f infrastructure/kubernetes/analytics-service-deployment.yaml

# Voice Bot
kubectl apply -f infrastructure/kubernetes/voice-bot-deployment.yaml
```

#### 6. Deploy Frontend

```bash
kubectl apply -f infrastructure/kubernetes/frontend-deployment.yaml
```

#### 7. Deploy Ingress

```bash
kubectl apply -f infrastructure/kubernetes/ingress.yaml
```

#### 8. Verify Deployment

```bash
# Check all pods
kubectl get pods -n banking-ai

# Check services
kubectl get svc -n banking-ai

# Check ingress
kubectl get ingress -n banking-ai

# View pod logs
kubectl logs -n banking-ai -f <pod-name>

# Describe pod for issues
kubectl describe pod -n banking-ai <pod-name>
```

### Auto-scaling

```yaml
# Horizontal Pod Autoscaler for API Gateway
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 2. Azure Container Instances (ACI) / App Service Deployment

### Using Azure App Service with Docker

```bash
# Login to Azure
az login

# Create Resource Group
az group create --name banking-ai-rg --location eastus

# Create App Service Plan
az appservice plan create \
  --name banking-ai-plan \
  --resource-group banking-ai-rg \
  --sku P1V2 \
  --is-linux

# Deploy from Docker Compose
az containerapp env create \
  --name banking-ai-env \
  --resource-group banking-ai-rg \
  --location eastus

# Deploy container apps
az containerapp create \
  --name api-gateway \
  --resource-group banking-ai-rg \
  --environment banking-ai-env \
  --image <registry>/api-gateway:latest \
  --environment-variables "PORT=5000"
```

### Using Azure DevOps for CI/CD

```yaml
# azure-pipelines.yml
trigger:
  - main

stages:
  - stage: Build
    jobs:
      - job: BuildServices
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: Docker@2
            inputs:
              command: buildAndPush
              repository: banking/api-gateway
              dockerfile: backend/api-gateway/Dockerfile
              containerRegistry: <registry>
              tags: |
                latest
                $(Build.BuildId)

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployToAKS
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - task: KubernetesManifest@0
                  inputs:
                    action: 'deploy'
                    kubernetesServiceConnection: 'aks-connection'
                    namespace: 'banking-ai'
                    manifests: |
                      infrastructure/kubernetes/*.yaml
```

## 3. AWS ECS/Fargate Deployment

```bash
# Create ECR repository
aws ecr create-repository --repository-name banking-ai-api-gateway

# Push image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker tag api-gateway:latest <account>.dkr.ecr.us-east-1.amazonaws.com/banking-ai-api-gateway:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/banking-ai-api-gateway:latest

# Create ECS Cluster
aws ecs create-cluster --cluster-name banking-ai-cluster

# Deploy task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create ECS service
aws ecs create-service --cluster banking-ai-cluster \
  --service-name api-gateway-service \
  --task-definition api-gateway:1 \
  --desired-count 2
```

## 4. Cloud Run (GCP) Deployment

```bash
# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable container.googleapis.com

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/<project>/api-gateway

# Deploy to Cloud Run
gcloud run deploy api-gateway \
  --image gcr.io/<project>/api-gateway \
  --platform managed \
  --region us-central1 \
  --set-env-vars "NODE_ENV=production,PORT=8080" \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10
```

## 5. Database Deployment

### PostgreSQL Managed Services

**Azure Database for PostgreSQL:**
```bash
az postgres server create \
  --resource-group banking-ai-rg \
  --name banking-db \
  --admin-user dbadmin \
  --admin-password <password> \
  --sku-name B_Gen5_2 \
  --storage-size 51200

# Run migrations
psql -h banking-db.postgres.database.azure.com -U dbadmin@banking-db -d postgres -f init.sql
```

**AWS RDS:**
```bash
aws rds create-db-instance \
  --db-instance-identifier banking-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 100
```

## 6. Redis Deployment

### Azure Cache for Redis
```bash
az redis create \
  --resource-group banking-ai-rg \
  --name banking-redis \
  --location eastus \
  --sku-name Basic \
  --sku-family C \
  --capacity 0
```

### AWS ElastiCache
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id banking-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --port 6379
```

## 7. SSL/TLS Configuration

### Using Let's Encrypt with Cert-Manager (Kubernetes)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Create Certificate Issuer
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@banking-ai.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## 8. Monitoring & Logging in Production

### Azure Monitor Integration

```bash
az monitor app-insights component create \
  --app api-gateway \
  --location eastus \
  --resource-group banking-ai-rg \
  --application-type web
```

### CloudWatch (AWS)

```bash
# Enable CloudWatch Logs for ECS
aws ecs update-service \
  --cluster banking-ai-cluster \
  --service api-gateway-service \
  --log-configuration awslogs-group=/ecs/banking-ai,awslogs-region=us-east-1,awslogs-stream-prefix=ecs
```

## 9. Backup Strategy

### Database Backups

```bash
# PostgreSQL automated backups
az postgres server update \
  --resource-group banking-ai-rg \
  --name banking-db \
  --backup-retention 35 \
  --geo-redundant-backup Enabled
```

### Automated Daily Backups
```bash
# Create backup script (daily via cron)
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR=/backups
pg_dump -h banking-db.postgres.database.azure.com \
  -U dbadmin \
  banking_ai_db > $BACKUP_DIR/backup-$DATE.sql.gz

# Upload to cloud storage
az storage blob upload \
  --account-name backupstorage \
  --container-name backups \
  --name "backup-$DATE.sql.gz" \
  --file $BACKUP_DIR/backup-$DATE.sql.gz
```

## 10. Disaster Recovery

### Recovery Plan

1. **RTO: 30 minutes** - Services back online
2. **RPO: 15 minutes** - Data loss acceptable up to 15 min

### Failover Procedure

```bash
# 1. Verify backup integrity
az backup restore-config-files ...

# 2. Restore database from backup
az PostgreSQL server restore ...

# 3. Restart container services
kubectl rollout restart deployment/api-gateway -n banking-ai

# 4. Verify health checks
kubectl get pods -n banking-ai
curl https://api.bankingai.com/health
```

## 11. Performance Tuning

### PostgreSQL Optimization
```sql
-- Connection pooling (pgBouncer)
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET work_mem = '20MB';
SELECT pg_reload_conf();
```

### Redis Optimization
```bash
# Increase available memory
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## 12. Production Checklist

- [ ] SSL/TLS certificates configured and valid
- [ ] Database backups automated and tested
- [ ] Monitoring and alerting enabled
- [ ] Log aggregation configured
- [ ] Auto-scaling policies set
- [ ] Load balancing configured
- [ ] Disaster recovery plan documented
- [ ] Security groups/firewall rules set
- [ ] Performance tests completed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Runbook created for common issues
