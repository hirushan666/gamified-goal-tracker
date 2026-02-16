# 🚀 Gamified Goal Tracker | Cloud-Native DevOps Architecture

<div align="center">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge&logo=jenkins)](https://github.com/hirushan666/gamified-goal-tracker)
[![Docker](https://img.shields.io/badge/docker-containerized-blue?style=for-the-badge&logo=docker)](https://hub.docker.com/u/hirushanww)
[![Infrastructure](https://img.shields.io/badge/Infrastructure-Terraform%20%7C%20Ansible-purple?style=for-the-badge&logo=terraform)](https://www.terraform.io/)
[![Cloud Provider](https://img.shields.io/badge/AWS-EC2-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)

**A production-ready Full Stack application deployed via a fully automated CI/CD pipeline.**
_Architected with Terraform, Configured with Ansible, and Orchestrated with Docker & Jenkins._

[View Demo](#) · [Report Bug](https://github.com/hirushan666/gamified-goal-tracker/issues) · [Request Feature](https://github.com/hirushan666/gamified-goal-tracker/issues)

</div>

---

## 🏗 System Architecture

This project demonstrates a **Cloud-Native DevOps Lifecycle**. The infrastructure follows the **Infrastructure as Code (IaC)** paradigm, and deployment is handled via a **Zero-Touch** pipeline.

![System Architecture](./assets/architecture.png)

### 🚀 Key Engineering Features

- **Infrastructure as Code:** AWS EC2 instances provisioned using **Terraform**.
- **Configuration Management:** Server environment setup automated via **Ansible**.
- **Containerization:** Full-stack services (Frontend, Backend, DB) isolated in **Docker** containers.
- **CI/CD Automation:** **Jenkins** pipeline triggers on Git push, runs tests, builds images, and deploys to production.
- **Traffic Management:** **Nginx** reverse proxy handles routing and CORS.

---

## 🛠 Built With

This project exploits a modern tech stack focused on scalability and automation.

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
- ![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
- ![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
- ![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
- ![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
- ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

---

## 📸 Application Demo

The application encourages habit consistency through gamification (XP, streaks, and rewards).

![Login Page](./assets/demo.png)

---

## ⚙️ The CI/CD Pipeline

The heart of this project is the automation pipeline. Every commit to the `main` branch triggers the following workflow:

![Jenkins Pipeline](./assets/pipeline.png)

1.  **Checkout:** Pulls the latest code from GitHub.
2.  **Clean Environment:** Removes orphaned containers/volumes.
3.  **Test:** Runs Unit & Integration tests (Jest).
4.  **Build & Push:** Builds Docker images and pushes to Docker Hub.
5.  **Deploy:** SSHs into the AWS Production Server and updates containers with zero manual intervention.

---

## ☁️ Deployment (AWS)

The production environment is hosted on an AWS EC2 instance, provisioned via Terraform.

![AWS Console](./assets/deployment.png)

### Manual Deployment Command (Reference)

The pipeline executes the following logic automatically:

```bash
docker run -d --name backend --network goal-tracker-net -p 3000:5000 \
  -e MONGO_URI='mongodb://mongo:27017/goaltracker' \
  -e JWT_SECRET='${SECRET}' \
  hirushanww/gamified-goal-tracker-backend:latest
```
