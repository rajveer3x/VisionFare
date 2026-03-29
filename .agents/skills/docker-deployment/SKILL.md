---
name: docker-deployment
description: Manages containerization of all microservices and orchestrates CI/CD pipelines.
---

## Objective
Generate Docker configurations for the UI, Backend, and AI services, and automate the deployment pipeline.

## Workflow
1. Construct a multi-stage Dockerfile for the React frontend.
2. Construct a Dockerfile for the Node.js backend.
3. Construct a Dockerfile for the Python FastAPI service.
4. Generate a docker-compose.yml file in the repository root to orchestrate the three containers, ensuring proper network bridging and environment variable injection.
5. Generate a .github/workflows/main.yml file to establish a GitHub Actions pipeline.
6. Configure the pipeline to trigger on pushes to the main branch, build the Docker images, and run basic verification tests.