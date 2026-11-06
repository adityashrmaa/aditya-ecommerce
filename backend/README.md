# Aditya E-Commerce Backend

REST API backend for the Aditya E-Commerce application, built using Java 21, Spring Boot, Spring Data JPA, Hibernate, and MySQL.

## Tech Stack
- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- Lombok

## Prerequisites
- Java 21 or later
- MySQL
- Maven

## Configuration
Create a MySQL database named `aditya`.

Set these environment variables:
- `DB_URL` - MySQL JDBC URL (default: `jdbc:mysql://localhost:3306/aditya`)
- `DB_USERNAME` - MySQL username (default: `root`)
- `DB_PASSWORD` - MySQL password (required)

## Run the Application
From the backend directory, run:

    ./mvnw spring-boot:run

The backend runs on port 8080 by default.

## API Endpoints

Base URL: `/api/products`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Retrieve all products |
| GET | `/api/products/{id}` | Retrieve a product by ID |
| POST | `/api/products` | Add a product |
| GET | `/api/products/{id}/image` | Retrieve a product image |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

Product creation and updates support multipart form data for product details and image uploads.

## Notes
- Product data is managed through Spring Data JPA.
- Hibernate handles database table creation and updates.
- Uploaded product images use the configured upload directory.
- Never commit database credentials to version control.
