# Luno - Project Management Application

![Project Logo](https://github.com/AbhijitSP11/proto-project-management/blob/master/client/public/thumbnail.png)

Luno is a modern project management application that leverages **Groq AI** to assist users in managing tasks and queries through a seamless chatbot experience. This repository contains the source code and setup instructions for creating a comprehensive project management dashboard. The AI-powered chatbot enhances user experience by answering queries and providing insights in real-time.

## Features
- **Groq AI Chatbot Integration**: Ask questions and get instant answers about your projects, deadlines, and tasks.
- **Project Dashboard**: Manage and visualize tasks, timelines, and resources.
- **Team Collaboration**: Assign tasks, track progress, and collaborate with team members.
- **Cloud-Enabled**: Fully scalable and secure, leveraging AWS services for deployment and management.

## Technology Stack
### **Frontend**:
- Next.js
- Tailwind CSS
- Redux Toolkit
- Material UI Data Grid

### **Backend**:
- Node.js with Express
- Prisma (PostgreSQL ORM)

### **Database**:
- PostgreSQL (managed with PgAdmin)

### **Cloud Services**:
- AWS EC2
- AWS RDS
- AWS API Gateway
- AWS Amplify
- AWS S3
- AWS Lambda
- AWS Cognito

## Getting Started

### Prerequisites
Ensure the following are installed:
- Git
- Node.js
- npm
- PostgreSQL (download [here](https://www.postgresql.org/download/))
- PgAdmin (download [here](https://www.pgadmin.org/download/))

### Installation Steps
1. Clone the repository:
   ```bash
   git clone [[repo_url]](https://github.com/AbhijitSP11/proto-project-management.git)
   cd luno-project-management

# Install client dependencies
```bash
cd client
npm install
```

# Install server dependencies
```cd ../server
npm install
```
```npx prisma generate
npx prisma migrate dev --name init
npm run seed
```
Configure environment variables:

Server: Create a ```.env``` file and include settings like ```PORT```, ```DATABASE_URL```.
Client: Create a ```.env.local``` file for client-side settings such as ```NEXT_PUBLIC_API_BASE_URL```.

```npm run dev```

Additional Resources
Groq AI Chatbot Documentation: Learn how the chatbot integration works.
AWS EC2 Setup Instructions: Step-by-step guide for setting up your EC2 instance.
Prisma: ORM for database management.
Tailwind CSS Configuration: Preconfigured styles for a responsive UI.
Redux Toolkit: Centralized state management for efficient handling of application data.
