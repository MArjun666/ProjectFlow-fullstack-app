# ProjectFlow - Full-Stack Project Management App


| Dashboard |
|:---:|
|<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/de257f01-3245-47a9-9118-69f6759cbd0f" />
| Project Section & Creating Project through button |
|<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2ea19f8d-7827-4c9d-a3ab-e9f6f8454ab5" />
| List of Assigned Tasks |
|<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e26402b5-7fb2-465d-add9-54d48f8ec2a5" />
| Project Tracking & User Task Tracking |
|<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/568701b3-b59b-4a40-bd95-32f1d5bc4f90" />
eed6506469765a954dfaadea5d43b96567e864ef

---

ProjectFlow is a modern, full-stack project management application designed for high-performing teams. It provides a clean, intuitive workspace to organize projects, assign tasks, track progress, and collaborate seamlessly.

The application is built with a robust **Spring Boot 3** backend and a dynamic **React 18** frontend, all connected to a **MongoDB** database.

## ✨ Key Features

-   **User Authentication:** Secure registration and login system using JWT (JSON Web Tokens).
-   **Role-Based Access Control:** Differentiates permissions for Admins, Project Managers, and Team Members.
-   **Full Project CRUD:** Create, read, update, and delete projects with detailed information.
-   **Team Management:** Easily add or remove team members from a project.
-   **Task Management:** Create, update, and delete tasks within each project and assign them to team members.
-   **Task Acceptance Flow:** Team members can accept or reject newly assigned tasks.
-   **Real-time Notifications:** Users receive notifications for important events like new task assignments or status updates.
-   **Personalized "My Tasks" View:** A dedicated page for users to see all tasks assigned directly to them across all projects.
-   **Progress Tracking:** Visual dashboards and progress meters to monitor project and team completion rates.

## 🛠️ Technology Stack

| Area      | Technology                                                                          |
| :-------- | :---------------------------------------------------------------------------------- |
| **Backend** | **Java 17**, **Spring Boot 3**, Spring Security, Spring Data MongoDB, JWT, Lombok, **Maven** |
| **Frontend**| **React 18**, React Router, Axios, CSS Modules (with a custom "Aurora" theme)         |
| **Database**| **MongoDB**                                                                         |

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   **Java JDK 17** or newer
-   **Apache Maven**
-   **Node.js v18.x** and **npm**
-   **MongoDB** (running on the default port `27017`)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Your-Username/projectflow-fullstack-app.git
    cd projectflow-fullstack-app
    ```

2.  **Run the Backend Server:**
    Open a terminal, navigate to the backend folder, and run the application using the Maven wrapper.

    ```bash
    cd projectflow-backend
    
    # On Windows (PowerShell)
    .\mvnw spring-boot:run
    
    # On Mac/Linux
    ./mvnw spring-boot:run
    ```
    The backend will start on `http://localhost:5001`.

3.  **Run the Frontend Application:**
    Open a **new, separate terminal**, navigate to the frontend folder, install dependencies, and start the development server.

    ```bash
    cd projectflow-frontend
    npm install
    npm start
    ```
    Your browser will automatically open to `http://localhost:3000`.

### Configuration

The backend configuration is located in `projectflow-backend/src/main/resources/application.properties`. The default settings expect MongoDB to be running locally.

```properties
# Server port for the backend
server.port=5001

# MongoDB connection string
spring.data.mongodb.uri=mongodb://localhost:27017/projectflow_db

# JWT secret key and expiration time
jwt.secret=ThisIsASuperLongAndVerySecureSecretKeyForJWTAuthenticationInProjectFlow12345

HEAD
jwt.expiration.ms=86400000

jwt.expiration.ms=86400000
eed6506469765a954dfaadea5d43b96567e864ef
