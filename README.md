# NASA Image Explorer

## Project Description

The **NASA Image Explorer** is a full-stack web application that allows users to search, view, and save images from NASA’s public image API. Built with **React (Vite)** on the frontend and **Node.js + Express + MongoDB** on the backend, the app features:

- User authentication via **Passport.js**
- Session-based login persistence
- Protected routes and secure access control

---

## Key Features

- **Search Interface** – Users can search for space-related images by keyword (e.g., “Mars”, “Apollo”).
- **Favorites Gallery** – Save selected images to a personal collection.
- **Account System** – Register, log in, and manage saved content.
- **Delete Support** – Remove saved items from Favorites.
- **GraphQL API** – Query user and image data via `/graphql`.

---

## Tech Stack

| Layer      | Tools / Libraries                 |
| ---------- | --------------------------------- |
| Frontend   | React (Vite), CSS Modules         |
| Backend    | Node.js, Express, PassportJS      |
| Database   | MongoDB + Mongoose                |
| Auth       | express-session, passport-local   |
| API Format | RESTful API + GraphQL (read-only) |

---

## Getting Started

### Prerequisites

There's a need to have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node)
- MongoDB (local instance running on default port `27017`)

---

## Database Initialization

To initialize the database with two default users, run the seeder script from the backend directory.

```Bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Run the seeder script
npm run seed
```

This will create the following two users in the database:

- User 1:

```Bash
Email: user@example.com
Password: password123!
```

- User 2

```Bash
Email: user2@example.com
Password: password234!
```

Note: You could also manually register users via the frontend after the application setup:

1. Navigate to the **Login page**
2. Click **Register**
3. Indicate the name, email address and password and follow suggestions if needed.

---

### Backend Setup

Open a terminal window and navigate to the backend directory.

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start backend server (http://localhost:5050)
npm start

```

---

### Frontend Setup

Open a second terminal window and navigate to the frontend directory.

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend (http://localhost:5173)
npm run dev
```
