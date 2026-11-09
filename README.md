# Aditya E-Commerce

A full-stack e-commerce application built using **Java, Spring Boot, Spring Data JPA, Hibernate, MySQL, React, and Axios**.

The project demonstrates REST API development, backend architecture, database integration, frontend development, and unit testing.

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Hibernate ORM
- Spring MVC
- MySQL
- Maven
- JUnit 5 and Mockito

### Frontend
- React.js
- JavaScript
- Axios
- Bootstrap
- HTML5
- CSS3

### Tools
- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git and GitHub

## Project Structure

```text
aditya-ecommerce/
│
├── backend/
│   └── src/
│       ├── main/
│       │   ├── java/com/aditya/ecom_proj/
│       │   │   ├── controller/
│       │   │   ├── model/
│       │   │   ├── repository/
│       │   │   ├── service/
│       │   │   └── EcomProjApplication.java
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│           └── java/com/aditya/ecom_proj/
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── Context/
│       ├── App.jsx
│       ├── axios.jsx
│       └── main.jsx
│
├── docs/
│   ├── API_TESTING.md
│   ├── DATABASE_SCHEMA.md
│   ├── CONTRIBUTING.md
│   └── ROADMAP.md
│
└── README.md
```

## Backend Architecture

The backend follows a layered architecture:

- **Controller Layer:** Handles incoming HTTP requests and API responses.
- **Service Layer:** Contains business logic.
- **Repository Layer:** Handles database operations using Spring Data JPA.
- **Model Layer:** Defines the Product entity and its database mapping.

## Getting Started

### Prerequisites

Make sure you have installed:

- Java 21 or compatible JDK
- Maven (or use the included Maven wrapper)
- MySQL
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/adityashrmaa/aditya-ecommerce.git
cd aditya-ecommerce
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure your MySQL database connection in:

`src/main/resources/application.properties`

Set your database URL, username, and password according to your local MySQL configuration.

### 3. Run the Backend

On macOS/Linux:

```bash
./mvnw spring-boot:run
```

Alternatively:

```bash
mvn spring-boot:run
```

### 4. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Testing

Backend unit tests can be executed using:

```bash
cd backend
./mvnw clean test
```

The project includes ProductService unit tests using JUnit 5 and Mockito.

## API Documentation

Refer to the following documentation:

- `docs/API_TESTING.md` — API testing guide.
- `docs/DATABASE_SCHEMA.md` — Product entity and database mapping.
- `docs/PROJECT_STRUCTURE.md` — Project architecture and directory structure.
- `docs/ROADMAP.md` — Development roadmap.
- `docs/CONTRIBUTING.md` — Contribution guidelines.

## Learning Objectives

This project is being developed to strengthen practical knowledge of:

- Java backend development
- RESTful API design
- Spring Boot application architecture
- ORM and database management
- React frontend integration
- Unit testing and mocking
- Git version control and collaborative development

## Author

**Aditya Sharma**

- GitHub: [@adityashrmaa](https://github.com/adityashrmaa)

---

⭐ If you find this project useful, feel free to explore the repository and its documentation.
