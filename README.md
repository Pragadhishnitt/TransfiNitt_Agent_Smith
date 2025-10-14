# TransfiNitt Agent Smith - AI Market Research Platform

## 🎯 **Project Overview**

This is a **hackathon MVP** for an AI-powered market research platform that conducts intelligent interviews with respondents. The platform consists of multiple microservices working together to create a complete market research ecosystem.

## 🏗️ **Architecture**

The platform follows a **microservices architecture** with the following components:

### **Core Services**
1. **Backend Service** (Node.js + Express) - `http://localhost:8000`
2. **AI Interviewer Agent** (Python FastAPI) - `http://localhost:8001` 
3. **Researcher Dashboard** (React) - `http://localhost:3000`
4. **Respondent Interview App** (React) - `http://localhost:3001`

## 📁 **Project Structure**

```
TransfiNitt_Agent_Smith/
├── ai_interviewer/          # AI Agent Service (Python FastAPI)
├── backend/                 # Backend API (Node.js + Express)
├── researcher-dashboard/     # Researcher Interface (React)
├── respondent-interview/    # Respondent Interview App (React)
├── docker-compose.yml      # Docker orchestration
├── nginx.conf             # Load balancer config
└── README.md              # Main project documentation
```

## 🔧 **Service Details**

### **1. AI Interviewer Agent Service** (`ai_interviewer/`)
- **Technology**: Python FastAPI
- **Purpose**: Intelligent conversation management
- **Features**:
  - Ultra-fast LLM responses using Groq
  - Redis-based conversation storage
  - Automatic sentiment analysis
  - Smart probing for vague responses
  - Conversation flow orchestration

**Key Endpoints**:
- `POST /agent/start` - Initialize interview session
- `POST /agent/chat` - Continue conversation
- `POST /agent/end` - Complete interview & get summary
- `GET /agent/health` - Health check

### **2. Backend Service** (`backend/`)
- **Technology**: Node.js + Express + Prisma
- **Purpose**: Main API gateway and data management
- **Features**:
  - JWT authentication
  - PostgreSQL database with Prisma ORM
  - Session management
  - Template management
  - Integration with AI agent service

### **3. Researcher Dashboard** (`researcher-dashboard/`)
- **Technology**: React + TailwindCSS
- **Purpose**: Interface for researchers to manage studies
- **Features**:
  - Template creation and management
  - Session monitoring
  - Respondent management
  - Analytics and insights
  - Incentive management

### **4. Respondent Interview App** (`respondent-interview/`)
- **Technology**: React + TailwindCSS
- **Purpose**: Interface for respondents to participate in interviews
- **Features**:
  - Voice-to-text input
  - Text-to-speech responses
  - Real-time chat interface
  - Interview completion tracking
  - Responsive design

## 🚀 **Quick Start**

### **Prerequisites**
- Docker and Docker Compose installed
- Git (to clone the repository)

### **Setup Instructions**

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TransfiNitt_Agent_Smith
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env` in the root directory
   - Configure database URLs, API keys, and service URLs

3. **Start all services with Docker Compose**:
   ```bash
   docker-compose up
   ```

   This single command will start all services:
   - Backend Service (Node.js + Express)
   - AI Agent Service (Python FastAPI)
   - Researcher Dashboard (React)
   - Respondent Interview App (React)
   - PostgreSQL Database
   - Redis Cache
   - Nginx Load Balancer

4. **Access the platform**:
   - Researcher Dashboard: `http://localhost:3000`
   - Respondent Interview: `http://localhost:3001`

### **Docker Commands**

```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend

# Rebuild and start services
docker-compose up --build

# Stop and remove volumes
docker-compose down -v
```

## 🔄 **Workflow**

1. **Researcher** creates interview templates via the dashboard
2. **System** generates interview links for respondents
3. **Respondents** access the interview app and participate in AI-conducted interviews
4. **AI Agent** manages the conversation flow, asks follow-up questions, and analyzes responses
5. **Researcher** reviews results, insights, and analytics through the dashboard

## 🛠️ **Development Team Structure**

- **Person 1**: Agent Service (Python FastAPI)
- **Person 2**: Backend (Node.js Express)
- **Person 3**: Dashboard (React)
- **Person 4**: Respondent App (React)
- **Person 5**: DevOps & Integration

## 📦 **Docker Support**

The entire platform is **fully containerized** for easy deployment and development:
- **Single Command Setup**: `docker-compose up` starts everything
- **Individual Dockerfiles** for each service
- **Docker Compose** for orchestration and service dependencies
- **Nginx** configuration for load balancing
- **PostgreSQL** and **Redis** containers included
- **No local dependencies** required (Node.js, Python, databases)

## 🔐 **Security & Authentication**

- JWT-based authentication
- Supabase integration for user management
- Protected routes and API endpoints
- Secure session management

## 📊 **Key Features**

- **Intelligent Interviews**: AI-powered conversation management
- **Real-time Communication**: Voice and text input/output
- **Sentiment Analysis**: Automatic emotion and sentiment tracking
- **Template Management**: Flexible interview template creation
- **Analytics Dashboard**: Comprehensive insights and reporting
- **Responsive Design**: Works across all devices
- **Microservices Architecture**: Scalable and maintainable

## 🌐 **Service URLs**

- **Backend API**: `http://localhost:8000`
- **AI Agent Service**: `http://localhost:8001`

## 📝 **Environment Variables**

Copy `.env.example` to `.env` in each service folder and configure:
- Database URLs
- API keys (Groq, Supabase)
- JWT secrets
- Service URLs

---

This platform represents a complete solution for conducting AI-powered market research interviews, combining modern web technologies with advanced AI capabilities to create an efficient and user-friendly research experience.
