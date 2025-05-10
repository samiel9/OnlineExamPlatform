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

## Use Cases

This section outlines common user interactions and the features available in the Online Exam Platform.

### Teacher Use Cases
- **Register and Login**: Create a teacher account or log in to access the platform.
- **Create Exam**: Set up a new exam with title, description, and settings (duration, visibility).
- **Add Questions**: Add various question types (multiple-choice, true/false, short answer) to an exam.
- **Edit Questions**: Modify existing questions or update question details.
- **Delete Questions**: Remove questions from an exam.
- **Publish Exam**: Make an exam available to students.
- **View Submissions**: See student submissions and answers for a given exam.
- **Grade Exam**: Manually grade short-answer or essay responses.
- **View Results**: Review scores and analytics for individual students or the entire class.
- **Manage Profile**: Update profile information and change password.

### Student Use Cases
- **Register and Login**: Create a student account or log in to the platform.
- **Browse Available Exams**: View a list of exams published by teachers.
- **Start Exam**: Begin an exam within the specified time limit.
- **Submit Answers**: Answer questions and submit the completed exam.
- **Auto-Graded Results**: View immediate scores for auto-gradable question types (e.g., multiple-choice).
- **View Detailed Feedback**: For graded exams, see correct answers and feedback on each question.
- **View Past Results**: Access historical exam results and performance analytics.
- **Manage Profile**: Update personal information and change password.

### Shared Use Cases
- **Authentication & Authorization**: Secure access with role-based permissions (teacher vs. student).
- **Responsive Interface**: Access the platform on desktop and mobile devices.
- **Dark/Light Theme**: Toggle between themes (if enabled in settings).

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

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- Docker and Docker Compose (for containerized deployment and simplified management)
- Make (for using the Makefile commands)

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/samiel9/OnlineExamPlatform.git
    cd OnlineExamPlatform
    ```

2.  **Install Dependencies**:
    Use the Makefile to install dependencies for both backend and frontend.
    ```bash
    make install-deps
    ```
    This command will run `npm install` in both the `backend` and `frontend` directories.

3.  **Environment Variables (auto-generated)**:
    When you run `make install-deps` or `make full-cycle`, the Makefile will auto-create any missing environment files:
    -  `./.env` with a randomly generated `JWT_SECRET` if it does not exist.
    -  `frontend/.env.development` with `PUBLIC_URL=.` if it does not exist.
    You can optionally override the `JWT_SECRET` by editing `./.env`.

## Development

You can run the frontend and backend services locally for development without Docker, or use Docker for a production-like environment.

### Local Development (without Docker)

-   **Start Backend Server**:
    ```bash
    make dev-backend
    ```
    This will start the backend server (usually on `http://localhost:5000`).

-   **Start Frontend Development Server**:
    ```bash
    make dev-frontend
    ```
    This will start the frontend development server (usually on `http://localhost:3000`).

### Dockerized Development & Production

The `Makefile` provides convenient targets for managing the application with Docker Compose.

-   **Build and Start Services (Default)**:
    ```bash
    make all
    ```
    Or simply:
    ```bash
    make
    ```
    This command builds the Docker images (if they don't exist or have changed) and starts all services (`mongo`, `backend`, `frontend`) in detached mode. The frontend will be accessible at `http://localhost:3000` and the backend at `http://localhost:5000`.

-   **Build Services Only**:
    If you only want to build or rebuild the Docker images without starting them:
    ```bash
    make build-services
    ```

-   **Start Services (assumes images are built)**:
    ```bash
    make start
    ```

-   **Stop Services**:
    ```bash
    make stop
    ```

-   **Restart Services**:
    ```bash
    make restart
    ```

-   **View Logs**:
    To view logs from all running services:
    ```bash
    make logs
    ```
    To follow logs: `docker compose logs -f`

-   **Check Service Status**:
    ```bash
    make ps
    ```

## Testing

-   **Run All Tests**:
    ```bash
    make test
    ```
    This runs both backend and frontend tests.

-   **Run Backend Tests**:
    ```bash
    make test-backend
    ```

-   **Run Frontend Tests**:
    ```bash
    make test-frontend
    ```

## Deployment

### Docker Deployment
The primary method for deployment is using Docker.
1.  Ensure your `.env` file is configured with a production `JWT_SECRET`.
2.  Build and start the services:
    ```bash
    make all
    ```
    This will build fresh images and start the containers. The application will be available on the ports defined in `docker-compose.yml` (frontend: 3000, backend: 5000, mongo: 27017 by default).

### Frontend Deployment to GitHub Pages
The frontend can be deployed as a static site to GitHub Pages. This setup assumes the backend is running and accessible (e.g., your local Dockerized backend or a publicly hosted backend).

1.  **Configure `package.json`**:
    Ensure the `homepage` field in `frontend/package.json` is correctly set for your GitHub Pages URL (e.g., `https://<username>.github.io/<repository-name>/`). This has been pre-configured for `https://samiel9.github.io/OnlineExamPlatform/`.

2.  **Deploy**:
    ```bash
    make deploy-frontend
    ```
    This command will build the frontend and deploy it to the `gh-pages` branch of your repository.

    **Note**: When using the GitHub Pages frontend, it will attempt to connect to the backend API at `http://localhost:5000/api` by default (as configured in `frontend/src/services/api.js`). Ensure your local backend (e.g., via `make start`) is running and accessible if you are testing the GitHub Pages deployment against it.

## Makefile Targets Summary

The `Makefile` in the project root provides several useful commands:

-   `make all` or `make`: (Default) Builds Docker images and starts all services.
-   `make install-deps`: Installs Node.js dependencies for backend and frontend.
-   `make dev-backend`: Starts the backend development server locally (no Docker).
-   `make dev-frontend`: Starts the frontend development server locally (no Docker).
-   `make test`: Runs all backend and frontend tests.
-   `make test-backend`: Runs backend tests.
-   `make test-frontend`: Runs frontend tests (CI mode).
-   `make build-services`: Builds all Docker images using `docker compose build`.
-   `make start`: Starts all services using `docker compose up -d --build`.
-   `make stop`: Stops all services using `docker compose down`.
-   `make restart`: Restarts all services using `docker compose restart`.
-   `make logs`: Shows logs from running services.
-   `make ps`: Shows the status of running services.
-   `make deploy-frontend`: Builds and deploys the frontend to GitHub Pages.
-   `make clean`: Removes `node_modules`, frontend `build` directory, and stops Docker containers.
-   `make clean-docker`: Stops Docker containers and removes images built by compose.
-   `make clean-build`: Removes the `frontend/build` directory.
-   `make clean-node-modules`: Removes `node_modules` from both backend and frontend.
-   `make full-cycle`: Installs dependencies, runs all tests, builds Docker services, and starts them in one command.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Ensure all tests pass (`make test`).
5. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments
- Thanks to all contributors and open-source libraries used in this project.
