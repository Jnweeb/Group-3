# Group 3 Student Management API

REST API for user authentication and student management. The API is built with Express, PostgreSQL, JWT, and Swagger UI.

## Quick Start

### Requirements

- Node.js 18 or later
- PostgreSQL
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root:

```env
JWT_SECRET=replace-with-a-long-random-secret

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

### Run the API

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

## Swagger API Documentation

Open the interactive Swagger UI in a browser:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger displays the documented routes and allows you to send requests directly from the browser.

For protected endpoints:

1. Register or log in using the authentication endpoints.
2. Copy the JWT returned by `/api/auth/login`.
3. Select **Authorize** in Swagger.
4. Enter the token as `Bearer your-jwt-token`.
5. Select **Authorize**, then try the protected endpoint.

## Authentication

Authentication uses a JWT bearer token. Include it in requests with this header:

```http
Authorization: Bearer <token>
```

Newly registered users receive the `student` role by default. Administrative operations require a user whose role is `admin`.

### Register

`POST /api/auth/register`

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

Validation:

- `name`, `email`, and `password` are required.
- Name must contain at least 2 characters.
- Email must contain `@`.
- Password must contain at least 6 characters.

Successful response: `201 Created`

```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student",
    "created_at": "2026-09-25T12:00:00.000Z"
  }
}
```

### Login

`POST /api/auth/login`

Request body:

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Successful response: `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student"
  }
}
```

### Get current user

`GET /api/auth/me`

Requires authentication. Returns the authenticated user's profile.

### Logout

`POST /api/auth/logout`

Requires authentication. The API returns a successful logout response. Since JWT authentication is stateless, the client should remove the stored token.

## Student Endpoints

All student endpoints require a valid JWT.

| Method | Endpoint | Required role | Description |
| --- | --- | --- | --- |
| `GET` | `/api/students` | `student`, `admin` | Retrieve all students |
| `POST` | `/api/students` | `admin` | Create a student |
| `PUT` | `/api/students/:id` | `admin` | Update a student |
| `DELETE` | `/api/students/:id` | `admin` | Delete a student |

### Create a student

`POST /api/students`

Request body:

```json
{
  "name": "John Smith"
}
```

The `name` field is required and cannot be blank.

### Update a student

`PUT /api/students/:id`

Request body:

```json
{
  "name": "John Smith Updated",
  "age": 21,
  "course": "BS Information Technology"
}
```

The `name`, `age`, and `course` fields are required. `age` must be a positive integer. The current database update implementation changes the student's name; `age` and `course` are currently validated by the route but are not persisted.

### Example request with cURL

```bash
curl http://localhost:3000/api/students \
  -H "Authorization: Bearer <jwt-token>"
```

## HTTP Status Codes

| Status | Meaning |
| --- | --- |
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `400` | Invalid request data |
| `401` | Authentication required or token is invalid/expired |
| `403` | Authenticated user does not have permission |
| `404` | Route or requested resource was not found |
| `500` | Unexpected server error |

## Error Handling

Unknown routes return a structured `404` response:

```json
{
  "success": false,
  "error": {
    "code": "ROUTE_NOT_FOUND",
    "message": "Route not found: GET /unknown-route",
    "details": null,
    "timestamp": "2026-09-25T12:00:00.000Z",
    "path": "/unknown-route"
  }
}
```

Unexpected errors return a sanitized `500` response so internal error details are not exposed:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong. Please try again later.",
    "details": null,
    "timestamp": "2026-09-25T12:00:00.000Z",
    "path": "/api/students"
  }
}
```

Authentication and validation middleware may return the following response shape:

```json
{
  "success": false,
  "message": "Authentication required"
}
```

## Project Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the API |
| `npm run dev` | Start the API with Nodemon |
