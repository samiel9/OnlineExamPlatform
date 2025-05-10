# Online Exam Platform

## Overview
The Online Exam Platform is a web-based application designed to facilitate the creation, management, and evaluation of online exams. It provides features for teachers to create exams, add questions, and view results, as well as for students to take exams and view their performance.

## Features
- **Teacher Features**:
  - Create and manage exams.
  - Add and edit questions.
  - View student results and submissions.
- **Student Features**:
  - Take exams.
  - View exam results.
- **Authentication**:
  - Secure login and registration for teachers and students.
- **Responsive Design**:
  - Optimized for both desktop and mobile devices.

## Project Structure
The project is divided into two main parts:

### Backend
- Built with Node.js and Express.
- Handles API requests, authentication, and database operations.
- Key directories:
  - `controllers/`: Contains logic for handling API requests.
  - `models/`: Defines database schemas using Mongoose.
  - `routes/`: Defines API endpoints.
  - `middleware/`: Contains authentication and role-based access control logic.

### Frontend
- Built with React.
- Provides a user-friendly interface for teachers and students.
- Key directories:
  - `pages/`: Contains page components for different routes.
  - `components/`: Reusable UI components.
  - `assets/styles/`: Global and theme-specific styles.

## Installation

### Prerequisites
- Node.js (v14 or later)
- Docker (optional, for containerized deployment)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd OnlineExamPlatform
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Start the development servers:
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend
     npm start
     ```

## Deployment
The project includes Docker support for easy deployment. Use the `docker-compose.yml` file to build and run the application:
```bash
docker-compose up --build
```

## Testing
- Backend tests are located in `backend/__tests__/` and can be run using:
  ```bash
  cd backend
  npm test
  ```
- Frontend tests are located in `frontend/src/__tests__/` and can be run using:
  ```bash
  cd frontend
  npm test
  ```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments
- Thanks to all contributors and open-source libraries used in this project.
