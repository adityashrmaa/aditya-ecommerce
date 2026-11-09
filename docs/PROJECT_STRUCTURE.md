# Project Structure

## Overview

The project contains two applications:

- `backend/` — Spring Boot application for product APIs and database operations.
- `frontend/` — React application for the user interface.

## Backend

- `EcomProjApplication.java` — Spring Boot entry point.
- `controller/ProductController.java` — Handles product API requests.
- `model/Product.java` — Product entity.
- `repository/ProductRepo.java` — Data access layer.
- `service/ProductService.java` — Product business logic.
- `resources/application.properties` — Application configuration.
- `ProductServiceTest.java` — Product service unit tests.

## Frontend

- `App.jsx` — Main application component.
- `main.jsx` — Frontend entry point.
- `axios.jsx` — Axios configuration.
- `components/` — Product, cart, checkout, home, navigation, and update components.
- `Context/Context.jsx` — Application context.
- `App.css` and `index.css` — Styling.
- `assets/` — Static assets.

## Root Directory

- `backend/` — Backend application.
- `frontend/` — Frontend application.
- `docs/` — Project documentation.
- `README.md` — Project overview and setup instructions.
