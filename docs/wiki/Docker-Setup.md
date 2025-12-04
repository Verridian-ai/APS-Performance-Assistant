# Docker Setup Guide

> ⏱️ **Estimated Time:** 20-30 minutes  
> 📋 **Difficulty:** Intermediate  
> 💻 **Prerequisites:** Docker Desktop installed

This guide walks you through running the APS Performance Assistant using Docker containers. Docker provides a consistent environment across different machines and simplifies deployment.

---

## 📑 Table of Contents

1. [What is Docker?](#-what-is-docker)
2. [Prerequisites](#-prerequisites)
3. [Install Docker Desktop](#step-1-install-docker-desktop)
4. [Clone the Repository](#step-2-clone-the-repository)
5. [Configure Environment Variables](#step-3-configure-environment-variables)
6. [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
7. [Option B: Manual Docker Commands](#option-b-manual-docker-commands)
8. [Verify the Installation](#step-4-verify-the-installation)
9. [Managing Containers](#-managing-containers)
10. [Troubleshooting](#-troubleshooting)

---

## 🐳 What is Docker?

**Docker** is a platform that packages applications and their dependencies into **containers**—lightweight, portable units that run the same way everywhere.

### Why Use Docker?

| Benefit | Description |
|---------|-------------|
| ✅ **Consistency** | Works the same on Windows, Mac, and Linux |
| ✅ **Isolation** | Each service runs in its own container |
| ✅ **Easy Setup** | One command to start everything |
| ✅ **Production-Ready** | Same containers deploy to cloud |
| ✅ **No Dependencies** | No need to install Python, Node.js, etc. |

### Architecture Overview

```mermaid
flowchart TB
    subgraph Docker["🐳 Docker Environment"]
        direction TB

        subgraph Containers["Containers"]
            FRONTEND["🌐 Frontend Container<br/>Next.js<br/>Port: 3000"]
            BACKEND["⚡ Backend Container<br/>FastAPI + PydanticAI<br/>Port: 8000"]
        end

        FRONTEND -->|API Calls| BACKEND
    end

    subgraph External["☁️ External Services"]
        NEON["🐘 Neon Postgres"]
        OPENAI["🧠 OpenAI API<br/>(GPT-5.0)"]
    end

    BACKEND --> NEON
    BACKEND --> OPENAI

    USER["👤 User"] --> FRONTEND
```

---

## 📋 Prerequisites

Before starting, ensure you have:

| Requirement | Minimum | Recommended | Check Command |
|-------------|---------|-------------|---------------|
| **Docker Desktop** | 4.0+ | Latest | `docker --version` |
| **Docker Compose** | 2.0+ | Latest | `docker compose version` |
| **RAM** | 4 GB | 8 GB+ | - |
| **Disk Space** | 5 GB | 10 GB+ | - |

### Already Set Up?

If you've already completed these guides, you can skip ahead:
- ✅ [[Neon-Database-Setup]] - Database connection string
- ✅ [[OpenAI-Setup]] - API key

---

## Step 1: Install Docker Desktop

### Windows

1. **Download** Docker Desktop from: **https://www.docker.com/products/docker-desktop/**
2. **Run** the installer (`Docker Desktop Installer.exe`)
3. **Follow** the installation wizard
4. **Enable** WSL 2 when prompted (recommended)
5. **Restart** your computer if requested
6. **Launch** Docker Desktop from the Start menu

<!-- 📸 SCREENSHOT: docker-01-download.png -->
> **📸 Screenshot Placeholder:** `docs/screenshots/docker/01-download.png`  
> **What to capture:** Docker Desktop download page

---

### macOS

1. **Download** Docker Desktop from: **https://www.docker.com/products/docker-desktop/**
2. **Open** the downloaded `.dmg` file
3. **Drag** Docker to your Applications folder
4. **Launch** Docker from Applications
5. **Grant** permissions when prompted
6. **Wait** for Docker to start (whale icon in menu bar)

---

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to the docker group (avoids needing sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

---

### Verify Docker Installation

7. **Open** a terminal (PowerShell, Terminal, or Command Prompt)
8. **Run:**
   ```bash
   docker --version
   ```
9. **Expected output:**
   ```
   Docker version 24.0.7, build afdd53b
   ```

10. **Test** Docker is running:
    ```bash
    docker run hello-world
    ```

> ✅ **What you should see:** "Hello from Docker!" message confirming Docker is working.

<!-- 📸 SCREENSHOT: docker-02-hello-world.png -->
> **📸 Screenshot Placeholder:** `docs/screenshots/docker/02-hello-world.png`  
> **What to capture:** Terminal showing successful hello-world output

---

## Step 2: Clone the Repository

11. **Open** a terminal
12. **Navigate** to where you want the project:
    ```bash
    cd ~/Projects  # or your preferred location
    ```
13. **Clone** the repository:
    ```bash
    git clone https://github.com/Verridian-ai/APS-Performance-Assistant.git
    ```
14. **Enter** the project directory:
    ```bash
    cd APS-Performance-Assistant
    ```

---

## Step 3: Configure Environment Variables

Docker needs your API keys and database connection to work.

### 3.1 Create Backend Environment File

15. **Create** the backend `.env` file:

    **Windows (PowerShell):**
    ```powershell
    Copy-Item .env.example backend/.env
    ```

    **Mac/Linux:**
    ```bash
    cp .env.example backend/.env
    ```

16. **Open** `backend/.env` in a text editor

17. **Fill in** your credentials:

```env
# ======================
# Required Configuration
# ======================

# OpenAI API Key (from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your-key-here

# Database URL (from Neon dashboard)
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# JWT Secret (generate a random string)
SECRET_KEY=your-super-secret-random-string-here

# ======================
# Optional Configuration
# ======================

# Model settings
LLM_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-large
```

> 💡 **Tip:** Generate a random SECRET_KEY using:
> ```bash
> openssl rand -hex 32
> ```

---

### 3.2 Create Frontend Environment File

18. **Create** the frontend `.env` file:

    ```bash
    # Create frontend/.env.local
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > frontend/.env.local
    ```

---

## Option A: Docker Compose (Recommended)

Docker Compose runs both frontend and backend with a single command.

### A.1 Create Docker Compose File

19. **Create** a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'

services:
  # Backend API Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: aps-backend
    ports:
      - "8000:8080"
    environment:
      - PORT=8080
    env_file:
      - ./backend/.env
    volumes:
      - ./documents:/code/documents:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Web Application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: aps-frontend
    ports:
      - "3000:8080"
    environment:
      - PORT=8080
      - NEXT_PUBLIC_API_URL=http://backend:8080
    depends_on:
      - backend
    restart: unless-stopped
```

---

### A.2 Build the Containers

20. **Open** a terminal in the project root directory
21. **Run** the build command:

```bash
docker compose build
```

> ⏳ **Wait:** First build takes 5-10 minutes.

---

### A.3 Start the Containers

22. **Run** the containers:

```bash
docker compose up -d
```

**Expected output:**
```
[+] Running 2/2
 ✔ Container aps-backend   Started
 ✔ Container aps-frontend  Started
```

---

### A.4 Access the Application

23. **Open** your browser
24. **Navigate** to: **http://localhost:3000**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## Option B: Manual Docker Commands

### B.1 Build Images

```bash
# Build backend
docker build -t aps-backend:latest ./backend

# Build frontend
docker build -t aps-frontend:latest ./frontend
```

### B.2 Create Network

```bash
docker network create aps-network
```

### B.3 Run Containers

```bash
# Backend
docker run -d --name aps-backend --network aps-network \
  -p 8000:8080 --env-file backend/.env aps-backend:latest

# Frontend
docker run -d --name aps-frontend --network aps-network \
  -p 3000:8080 -e NEXT_PUBLIC_API_URL=http://aps-backend:8080 \
  aps-frontend:latest
```

---

## Step 4: Verify the Installation

### Check Container Status

```bash
docker ps
```

### Test the API

```bash
curl http://localhost:8000/health
```

**Expected:** `{"status": "healthy"}`

---

## 🎛️ Managing Containers

| Action | Command |
|--------|---------|
| Start | `docker compose up -d` |
| Stop | `docker compose down` |
| Logs | `docker compose logs -f` |
| Rebuild | `docker compose build --no-cache` |
| Remove all | `docker compose down -v --rmi all` |

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find what's using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux
```

### Container Keeps Restarting

```bash
docker logs aps-backend
```

Check for:
- Missing environment variables
- Invalid API keys
- Database connection issues

### Out of Disk Space

```bash
docker system prune -a
```

---

## ✅ Verification Checklist

- [ ] Docker Desktop installed
- [ ] Repository cloned
- [ ] `backend/.env` configured
- [ ] Containers built
- [ ] Containers running
- [ ] http://localhost:3000 works
- [ ] Can send chat messages

---

## 🎉 Congratulations!

Your Docker setup is complete! Access the app at **http://localhost:3000**

**Next:** [[User-Guide|Learn how to use the assistant →]]
