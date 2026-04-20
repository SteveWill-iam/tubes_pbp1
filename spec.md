# API Specification

This document outlines the REST API endpoints available in the application.

## Authentication Routes (`/auth` or `/api/auth`)

| Method | Endpoint | Description | Auth Required | Expected Body / Form Data |
|---|---|---|---|---|
| POST | `/login` | Authenticate an admin user and return a token | No | `{ "username": "...", "password": "..." }` |

## Product Routes (`/products` or `/api/products`)

| Method | Endpoint | Description | Auth Required | Expected Body / Form Data |
|---|---|---|---|---|
| GET | `/` | Get a list of all products | No | None |
| GET | `/:id` | Get a specific product by its ID | No | None |
| POST | `/` | Create a new product | Yes (Admin) | `multipart/form-data` with `image` field |
| PUT | `/:id` | Update an existing product | Yes (Admin) | `multipart/form-data` with `image` field |
| DELETE | `/:id` | Delete a product | Yes (Admin) | None |

## Category Routes (`/categories` or `/api/categories`)

| Method | Endpoint | Description | Auth Required | Expected Body / Form Data |
|---|---|---|---|---|
| GET | `/` | Get a list of all categories | No | None |
| GET | `/:id` | Get a specific category by its ID | No | None |
| POST | `/` | Create a new category | Yes (Admin) | JSON body with category details |
| PUT | `/:id` | Update an existing category | Yes (Admin) | JSON body with category details |
| DELETE | `/:id` | Delete a category | Yes (Admin) | None |

## Order Routes (`/orders` or `/api/orders`)

| Method | Endpoint | Description | Auth Required | Expected Body / Form Data |
|---|---|---|---|---|
| POST | `/` | Create a new order (Checkout) | No | JSON body with cart items & user details |
| GET | `/` | Get a list of all orders | Yes | None |
| GET | `/:id` | Get order details by ID | Yes | None |
| PATCH | `/:id/status` | Update order status | Yes | `{ "status": "..." }` |
| PATCH | `/:id/payment/confirm` | Confirm payment for an order | Yes | None / Payment confirmation details |

## Admin Management Routes (`/admins` or `/api/admins`)

*Note: All routes in this section require `admin` role authorization.*

| Method | Endpoint | Description | Auth Required | Expected Body / Form Data |
|---|---|---|---|---|
| GET | `/` | Get a list of all admin users | Yes (Admin) | None |
| GET | `/:id` | Get details of a specific admin user | Yes (Admin) | None |
| POST | `/` | Create a new admin user | Yes (Admin) | JSON body `{ "username": "...", "password": "..." }` |
| PUT | `/:id` | Update an admin user | Yes (Admin) | JSON body with updated admin details |
| DELETE | `/:id` | Delete an admin user | Yes (Admin) | None |

## Stat Routes (`/stats` or `/api/stats`)

| Method | Endpoint | Description | Auth Required | Expected Body / Form Data |
|---|---|---|---|---|
| GET | `/` | Get dashboard statistics | Yes | None |
