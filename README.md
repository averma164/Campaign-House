# 🏠 Campaign House

![GitHub repo size](https://img.shields.io/github/repo-size/averma164/Campaign-House)
![GitHub stars](https://img.shields.io/github/stars/averma164/Campaign-House?style=social)
![GitHub forks](https://img.shields.io/github/forks/averma164/Campaign-House?style=social)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Overview

**Campaign House** is a premium, feature-rich campaign management platform built to orchestrate, monitor, and analyze marketing and promotional campaigns.

It includes a responsive dashboard, secure authentication system, real-time-like notifications, advanced filtering, and dynamic analytics.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

* JWT-based secure authentication
* Role-based access control (`user`, `admin`)
* Admin-only campaign creation
* Owner-based edit/delete permissions

### 📊 Analytics Dashboard

* Campaign status visualization
* Category distribution charts
* Timeline-based analytics

### 🌍 Smart Filtering & Targeting

* Filter by **State, City, Pincode**
* Case-insensitive & partial search
* Cursor-based pagination

### 🔔 Notification System

* Alerts for create/update/delete actions
* Mark notifications as read
* Clear individual or all notifications

### 🎨 Modern UI/UX

* Built with **React + TypeScript**
* Glassmorphism design system
* Particle background animations
* Fully responsive layout

---

## 🛠️ Tech Stack

### 🌐 Frontend

* React + TypeScript + Vite
* React Router v7
* Recharts (Data Visualization)
* FontAwesome (Icons)
* Custom CSS + Glassmorphism UI

### ⚙️ Backend

* FastAPI (Python)
* SQLModel (ORM)
* PostgreSQL / SQLite
* Alembic (Migrations)
* Passlib + JWT Authentication

---

## 📂 Project Structure

```
Campaign-House/
│
├── Backend/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── utils/
│   ├── alembic/
│   ├── requirements.txt
│   ├── main.py
│   └── database.db
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── lib/
    │   ├── AppShell.tsx
    │   ├── App.tsx
    │   ├── Analytics.tsx
    │   ├── Profile.tsx
    │   ├── Notifications.tsx
    │   ├── Login.tsx
    │   ├── Signup.tsx
    │   ├── index.css
    │   ├── theme.css
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## ⚙️ Getting Started

### 📌 Prerequisites

* Node.js (v18+)
* Python (v3.10+)
* PostgreSQL (or SQLite for development)

---

## 🔧 Backend Setup

```bash
cd Backend
```

### Create Virtual Environment

**Windows:**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Mac/Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql+psycopg2://<username>:<password>@localhost:5432/<database_name>
SECRET_KEY=your_secret_key
```

### Run Server

```bash
uvicorn main:app --reload
```

## 💻 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

## 🗄️ Database Schema

### 👤 User

* id, email, password
* role (user/admin)
* location fields

### 📢 Campaign

* name, description, status
* owner, category
* location targeting
* media & URLs

### 🏷️ Category

* predefined campaign types

### 🔔 Notification

* user-based alerts
* read/unread tracking

---

## 🎨 UI & Theme

* Glassmorphism cards
* Custom CSS variables
* Particle animations (tsParticles)
* Dark/light themed system

---

## 📸 Screenshots 
Index:-
<img width="1918" height="908" alt="image" src="https://github.com/user-attachments/assets/4654e5b0-8986-4f30-b25f-4c0a1d7e67c0" />
<img width="1918" height="913" alt="image" src="https://github.com/user-attachments/assets/15424e2a-4ee4-470a-94ab-886ac21cfc96" />
Login:-
<img width="1903" height="911" alt="image" src="https://github.com/user-attachments/assets/23eb4f4e-8388-4e99-941d-6e4c79e46430" />
Signup:-
<img width="1918" height="913" alt="image" src="https://github.com/user-attachments/assets/89e570f3-eb55-434e-aa7c-845b94be37e7" />
Create :-
<img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/2d17ea11-86d3-41cb-ae53-6dd9a041b988" />
<img width="1912" height="907" alt="image" src="https://github.com/user-attachments/assets/f427fc96-414a-4cb8-9ba1-78ddc4474a47" />
Notifications:
<img width="1918" height="902" alt="image" src="https://github.com/user-attachments/assets/9bf65e40-215e-49af-a240-de658b62147f" />
About:-
<img width="1918" height="903" alt="image" src="https://github.com/user-attachments/assets/ba6b1c29-da9e-406a-a76a-541f786d2c74" />
Analytics:
<img width="1477" height="797" alt="image" src="https://github.com/user-attachments/assets/1cc6ee27-09f4-40dc-933e-8903efb2e4f9" />
Profile :-
<img width="1918" height="906" alt="image" src="https://github.com/user-attachments/assets/0a8f64f3-b4be-49d0-bec8-007ba0b8bdfc" />


---

## 🤝 Contributing

Contributions are welcome!

```bash
fork → clone → branch → commit → push → PR 🚀
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 💡 Author

**Aditi Verma**

* B.Tech CSE @ VIT Bhopal
* Aspiring Software Developer 💻

---

⭐ If you like this project, give it a star!
