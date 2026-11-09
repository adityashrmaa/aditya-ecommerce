# API Testing Guide

## Overview

This guide explains how to test the Aditya E-Commerce REST API.

## Base URL

`http://localhost:8080/api/products`

## Prerequisites

- Java 21 or later
- MySQL database configured
- Backend application running
- Postman or another REST API client

## Starting the Backend

From the backend directory:

```bash
./mvnw spring-boot:run
```

## Available Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | Retrieve all products |
| GET | `/api/products/{id}` | Retrieve a product by ID |
| POST | `/api/products` | Create a product |
| GET | `/api/products/{id}/image` | Retrieve a product image |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

## Testing Workflow

### Retrieve All Products

- Method: GET
- URL: `http://localhost:8080/api/products`

### Retrieve a Product

- Method: GET
- URL: `http://localhost:8080/api/products/1`

### Create a Product

- Method: POST
- Content-Type: `multipart/form-data`
- `product`: Product details as JSON
- `imageFile`: Product image file

### Retrieve a Product Image

- Method: GET
- URL: `http://localhost:8080/api/products/1/image`

### Update a Product

- Method: PUT
- Content-Type: `multipart/form-data`
- `product`: Updated product details as JSON
- `imageFile`: Replacement image, if required

### Delete a Product

- Method: DELETE
- URL: `http://localhost:8080/api/products/1`

## Automated Tests

From the backend directory:

```bash
./mvnw clean test
```

The backend includes ProductService unit tests using JUnit 5 and Mockito.

## Notes

- Start the backend before sending API requests.
- Use an existing product ID for individual product operations.
- Configure database credentials through environment variables.
- Product creation and updates use multipart form data.
