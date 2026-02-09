# 🏥 CareConnect - Hospital Appointment Booking System

A simple hospital appointment booking system with a Node.js + Express backend and a React + Vite frontend. Includes authentication, role-based access, real-time notifications (Socket.IO), and a seeded admin user.


## 🛠 Tech stack

### 🖥 Backend
- Node.js + Express - Server framework
- MongoDB + Mongoose - Database & ODM
- Socket.IO - Real-time notifications
- JWT - Authentication & authorization
- Bcrypt - Password hashing

### ⚛️ Frontend
- React - UI library
- Vite - Build tool & dev server
- React Router - Navigation
- Axios - HTTP client
- Context API - State management
- Tailwind CSS - Styling


## Repository structure

- `server/` - Express server, MongoDB models, routes, controllers and seed script
- `ui/` - React application using Vite


## ⚙️ Prerequisites
Before you begin, ensure you have:

- Node.js (v18+ recommended) 🟢
- npm or yarn 📦
- MongoDB instance (local or cloud) 🗄️


## 📝 Environment Setup

Create a `.env` file in `server/` with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/hospital-db
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

# admin user details
name = Super Admin
email = admin@hospital.com
password = admin@123
```

Adjust values as needed (for example use a MongoDB Atlas URI).


## 🚀 Install and run (development)

1. 📥 Clone the repository 

    ```bash
        git clone <repo-url>
        cd Hospital-Appointment-Booking-System
    ```
2. 🔧 Start the backend

    ```bash
        cd server
        npm install
        npm run dev
    ```

   - The server connects to MongoDB, runs the admin seed, and starts on the port from `PORT`.

3. 🎨 Start the frontend

    ```bash
        cd ../ui
        npm install
        npm run dev
    ```

   - Vite dev server typically runs at `http://localhost:5173`.


## 🌐 Build and run (production)

1. 🏗️ Build the UI

    ```bash
        cd ui
        npm run build
    ```

2.⚙️ Serve the static files (example: use a static host or integrate with Express). Start the server in production mode:

    ```bash
        cd ../server
        npm install --production
        npm start
    ```

## 👤 Seeded admin user

On server start the seed script (`server/Seed/adminSeed.js`) runs and creates a default admin if it does not exist. Check that your MongoDB connection allows writes.


## 📡 Available routes (overview)

- `POST /auth/...` - authentication (login/register)
- `GET/POST /admin/...` - admin operations
- `GET/POST /doctors/...` - doctor management
- `GET/POST /appointments/...` - appointments
- `GET/POST /notifications/...` - notifications (real-time via Socket.IO)

Refer to the route files in `server/Routes` for full details.


## 🔔 Real-time notifications

The backend exposes a Socket.IO server. The frontend client connects to `http://localhost:5173` (see `CLIENT_URL`) and listens for `new_notification` events. The server maps connected users to socket ids and emits notifications using `emitNotification(userId, data)`.


## 🐛 Notes and troubleshooting

- Ensure `MONGODB_URI` is correct and reachable from your machine.
- If ports conflict, update `PORT` and Vite dev server port in `ui` if necessary.
- If the admin seed is not creating the admin, check server logs for MongoDB connection errors.
