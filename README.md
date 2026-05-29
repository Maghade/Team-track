# Team Tracker API

A backend Task Management API built using Node.js, Express.js, MongoDB, and JWT Authentication with Role-Based Access Control (RBAC).

---

# Features

* User Authentication (Register/Login)
* JWT Authorization
* Role-Based Access Control
* ADMIN / MANAGER / MEMBER roles
* Create Tasks
* Assign Tasks
* Update Tasks
* Delete Tasks
* Task Status Workflow
* Pagination & Filtering
* Protected Routes

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

---

# Roles & Permissions

## ADMIN

* Manage all tasks
* Access all routes

## MANAGER

* Create tasks
* Assign tasks
* Update/Delete own tasks

## MEMBER

* View assigned tasks
* Update assigned task status

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Maghade/Team-track.git
```

## Navigate to Project

```bash
cd Team-track
```

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URL
JWT_SECRET=mysecretkey
```

---

# Run Project

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

---

# API Endpoints

# Authentication

## Register User

POST `/api/auth/register`

## Login User

POST `/api/auth/login`

---

# Tasks

## Create Task

POST `/api/tasks/create`

Access:

* ADMIN
* MANAGER

---

## Get Tasks

GET `/api/tasks`

Access:

* ADMIN
* MANAGER
* MEMBER

Supports:

* Pagination
* Filtering

Example:

```bash
/api/tasks?page=1&limit=5&status=TODO
```

---

## Update Task

PUT `/api/tasks/:taskId`

Access:

* ADMIN
* MANAGER

---

## Delete Task

DELETE `/api/tasks/:taskId`

Access:

* ADMIN
* MANAGER

---

## Update Task Status

PUT `/api/tasks/update-status/:taskId`

Access:

* MEMBER

Valid Flow:

```txt
TODO → IN_PROGRESS → DONE
```

---

# Project Structure

```txt
src/
 ├── controllers
 ├── middleware
 ├── models
 ├── routes
 ├── app.js
server.js
```

---

# Author

Achira Maghade
