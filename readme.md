# 🚀 OrbitDeck — Modular Kubernetes-native Deployment Platform

**OrbitDeck** is a modern, full-stack PaaS-like platform that enables seamless deployment, management, and analytics of containerized applications using **Kubernetes**, **Helm**, **Go**, **Spring Boot**, **React**, and **Redis**. It is fully modular — each service is independently deployable and testable.

<div style="position: relative; padding-bottom: 65%; height: 0; overflow: hidden; max-width: 100%; height: auto;">
  <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <source src="https://cdn.pixelbin.io/v2/odd-flower-9c88f6/original/assets/orbitdeck.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

---

## 📚 Table of Contents

- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [Technology Stack](#-technology-stack)
- [Monorepo Structure](#-monorepo-structure)
- [Local Development](#-local-development)
- [Deployment via Terraform on Azure](#-deployment-via-terraform-on-azure)
- [API Services](#-api-services)
- [Frontend Highlights](#-frontend-highlights)
- [Modularity &amp; Extensibility](#-modularity--extensibility)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✅ Features

- ⚙️ **Multi-Component Kubernetes Deployments** via Helm
- 🛠 **Asynchronous Task Execution** using Asynq (Go + Redis)
- 📊 **Centralized Analytics & Logging** (Java Spring Boot + PostgreSQL)
- 🔐 **Authentication with JWT + Cookies** (Go)
- 🧠 **Live Deployment Status** with polling and event-driven updates
- 🌐 **Dynamic Ingress Rule Mapping** for each deployed component
- 📈 **User Analytics**: Top used repositories, error tracking, component usage
- 🧪 **Modular Services**: Each service is testable and deployable independently
- ☁️ **Infrastructure-as-Code** using Terraform to provision Azure AKS, VNet, Subnets, AAD

---

## 🧱 Architecture Overview

![orbitdeck](https://cdn.pixelbin.io/v2/odd-flower-9c88f6/original/assets/orbitdeck.svg)

---

## 🛠 Technology Stack

### Backend

- **Go** (Gin, Asynq) – Task management, core deployment APIs
- **Spring Boot (Java)** – Analytics + Logging
- **Redis** – Queueing (Asynq) + Pub/Sub Events
- **PostgreSQL** – Primary database

### Frontend

- **React.js** – Dashboard, forms, analytics, live status
- **Styled Components** – Theming and modern UI

### DevOps

- **Docker + Skaffold** – Containerization + local dev sync
- **Helm** – Kubernetes deployment automation
- **Terraform** – Provisioning AKS, AAD, VNet on Azure
- **NGINX Ingress Controller** – API Gateway routing

---

## 🗂 Monorepo Structure

```bash
.
├── client/                # React Frontend
├── server/
│   ├── auth/              # Go Auth Service
│   ├── core/              # Go Deployment Service
│   └── analytics/         # Java Spring Boot Analytics
├── infra/
│   └── resources/         # Azure AKS, PostgreSQL, Redis, VNet Terraform Code
│   └── helm/              # Helm Charts
│   └── skaffold           # Local Dev Config
```

## 🧪 Local Development

```bash
# Backend (Go services)

cd server/core
go run main.go

# Analytics Service

cd server/analytics
./mvnw spring-boot:run

# Frontend

cd client
npm install && npm run dev
```

Or use Skaffold for live sync:

```bash
skaffold dev -p dev
```

---

## ☁️ Deployment via Terraform on Azure

1. Set up Terraform:

```bash


terraform init
terraform plan
terraform apply
```

2. This will provision:

- AKS Cluster with RBAC
- Azure VNet, Subnet
- PostgreSQL + Redis
- Azure AD Group for Admin Access

3. Configure `kubeconfig`:

```bash
   az aks get-credentials --resource-group <rg-name> --name <cluster-name>
```

4. Deploy services via Helm:

```bash
helm upgrade --install orbitdeck charts/orbitdeck/ -n orbitdeck
```

---

## 🔌 API Services

### Auth Service (Go)

- `POST /users` – Register
- `POST /users/login` – Login (PASETO Token + Cookie)
- `GET /me` – Get Current User
- `POST /users/logout` – Logout

### Core Deployment Service (Go)

- `POST /deployment/add` – Create New Deployment
- `GET /deployment/:id` – Get Deployment Details
- `DELETE /deployment/:id` – Uninstall Deployment
- `GET /deployment/:id/status` – Live Status (Asynq Task)

### Analytics Service (Spring Boot)

- `GET /events/recent` – Get Recent Events
- `GET /events/stats` – Summary of deployments
- `GET /events/component/usage` – Top used components
- `GET /events/timeline?interval=day|hour` – Timeline analytics
- `GET /events/errors` – Crash logs and failure insights

---

## 🌐 Frontend Highlights

- **Modern Dashboard** – List + manage all deployments
- **Deployment Wizard** – Add components, resource limits, env vars, ingress
- **Live Polling** – Track deployment status in real time
- **User Profile Page** – Top used repos, active installs, analytics
- **Confetti Success Feedback** – Post successful deployment 🎉

---

## 🔄 Modularity & Extensibility

Each service is **self-contained** and:

- Has its own Dockerfile
- Exposes only relevant routes
- Can be deployed/tested independently
- Communicates via Redis queues or events

This makes OrbitDeck easy to **extend** , scale, or rewire into different infrastructure setups.

---

## 🖼 Screenshots

> _Coming Soon — add UI snapshots or animations here for visual flair_

---

## 📄 License

MIT License © 2025 Rishabh Kanojiya

---

## ✨ Contributors

Made with ❤️ by [Rishabh Kanojiya](https://www.linkedin.com/in/rishabhkanojiya/)
