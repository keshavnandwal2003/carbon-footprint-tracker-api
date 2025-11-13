# 🌱 Carbon Footprint Tracker API

![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)
![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange)

> A RESTful API for tracking and managing carbon emissions from various daily activities — transport, energy, food, waste, and more.

Developed by **[Keshav Nandwal](https://github.com/keshavnandwal2003)**

---

## 🚀 Overview

The **Carbon Footprint Tracker API** enables users to log their daily activities and calculate their associated carbon emissions.  
It helps individuals and organizations monitor, analyze, and reduce their environmental impact through data-driven insights.

### ✨ Key Features

- 🔐 **User Authentication** using JWT
- 📊 **Activity Tracking** (transport, food, waste, etc.)
- 📅 **Emission History** with user-based records
- 🧮 **Summaries** and category-wise breakdowns
- ⚙️ **Modular Architecture** for scalability
- 🧾 **MongoDB Integration** via Mongoose
- 🧰 **Environment Configurations** using `.env`
- 🐞 **Centralized Error Handling** middleware
- 🔄 **Nodemon** for live reloading during development

---

## 🧰 Tech Stack

| Layer          | Technology                |
| -------------- | ------------------------- |
| Runtime        | Node.js                   |
| Framework      | Express.js                |
| Database       | MongoDB + Mongoose        |
| Authentication | JWT (JSON Web Token)      |
| Dev Tools      | Nodemon, ESLint, Prettier |
| Env Config     | Dotenv                    |

---

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites

- Node.js (v16 or newer)
- MongoDB (local or Atlas)
- npm or yarn

### 2️⃣ Clone & Install

```bash
git clone https://github.com/keshavnandwal2003/carbon-footprint-tracker-api.git
cd carbon-footprint-tracker-api
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

_(You can copy from `.env.example` if available.)_

### 4️⃣ Run the Server

```bash
npm run dev
```

---

## 🌍 Server Information

**Server runs at:**  
👉 [http://localhost:5000](http://localhost:5000)

---

## 📚 API Endpoints (Basic Summary)

| Method     | Endpoint                     | Description                       | Auth |
| ---------- | ---------------------------- | --------------------------------- | ---- |
| **POST**   | `/api/v1/users/register`     | Register new user                 | ❌   |
| **POST**   | `/api/v1/users/login`        | User login & get JWT              | ❌   |
| **GET**    | `/api/v1/footprints`         | Get all user emissions            | ✅   |
| **POST**   | `/api/v1/footprints`         | Create new emission record        | ✅   |
| **DELETE** | `/api/v1/footprints/:id`     | Delete an emission                | ✅   |
| **GET**    | `/api/v1/footprints/summary` | Get category-wise total emissions | ✅   |

> ✅ **requires Authorization header:**  
> `Authorization: Bearer <token>`

---

## 🧱 Project Structure

```
carbon-footprint-tracker-api/
│
├── config/              # DB connection & app configuration
├── controllers/         # Business logic for each route
├── middleware/          # Authentication & error handling
├── models/              # Mongoose schemas
├── routes/              # Express route definitions
├── server.js            # Application entry point
├── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are **welcome** 💚

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## 🧭 Future Enhancements

- [ ] Swagger/OpenAPI documentation
- [ ] Role-based access control
- [ ] PDF/CSV report export
- [ ] Monthly emission trends
- [ ] Frontend dashboard for analytics

---

💚 _Let’s code for a cleaner, greener planet._
