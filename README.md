# NASA Image Explorer

## Project Description

The **NASA Image Explorer** is a full-stack web application that allows users to search, view, and save their favorite images from NASA’s public image API. It features a secure and persistent authentication system using Passport.js and a MongoDB session store, ensuring that user data and saved favorites are always protected. The backend is architected with both a RESTful API for standard operations and a read-only GraphQL endpoint for flexible data queries.

### **Live Application**

- **Frontend (Netlify):** [https://nasa-images-explorer.netlify.app/](https://nasa-images-explorer.netlify.app/)
- **Backend (Render):** [https://nasa-imgs.onrender.com/](https://nasa-imgs.onrender.com/)

---

## Key Features

- **Search Interface** – Users can search for space-related images by keyword (e.g., “Mars”, “Apollo”).
- **Favorites Gallery** – Save selected images to a personal collection.
- **Account System** – Register, log in, and manage saved content.
- **Delete Support** – Remove saved items from Favorites.
- **GraphQL API** – Query user and image data via `/graphql`.

---

## Tech Stack

| Layer              | Tools & Libraries                                                       |
| ------------------ | ----------------------------------------------------------------------- |
| **Frontend**       | React (Vite), CSS, React Router                                         |
| **Backend**        | Node.js, Express, Passport.js                                           |
| **Database**       | MongoDB, Mongoose                                                       |
| **Authentication** | `express-session`, `passport-local`, `connect-mongo`                    |
| **API Formats**    | RESTful API & GraphQL (read-only)                                       |
| **Deployment**     | **Frontend:** Netlify, **Backend:** Render, **Database:** MongoDB Atlas |

---

## Getting Started with the Live App

To explore the application, simply visit the live [site](https://nasa-images-explorer.netlify.app/). You can create a new account by navigating to the **Login** page and clicking **Register**.
