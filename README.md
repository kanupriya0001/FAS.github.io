# 🏫 Faculty Appointment Scheduler

A web-based system designed to streamline the process of scheduling and managing faculty appointments.  
Students can request appointments with faculty, and faculty members can view, accept, or reject those requests through their own dashboards.

## 🚀 Features

### 👩‍🎓 Student Dashboard
- View available faculty members
- Request appointments with date and time
- Track request status (Pending / Accepted / Rejected)

### 👨‍🏫 Faculty Dashboard
- View all incoming appointment requests
- Accept or reject requests in real time
- Manage all confirmed appointments

## 🧩 Tech Stack

Technology 
Frontend - HTML, CSS, JavaScript (React via CDN + Babel) |
Backend - Node.js, Express.js |
Database - MySQL |
Runtime Environment - Node.js |

## ⚙️ Project Structure
FacultyAppointmentScheduler/
│
├── index.html # Main entry point
├── app.js # Front-end logic (React)
├── api.js # Front-end API calls
├── style.css # Styling for both dashboards
├── server.js # Node.js + Express backend
├── db.js # MySQL connection configuration
├── package.json # Node dependencies & scripts
└── README.md # Project documentation

## 🧠 How It Works

1. **Students** submit appointment requests to faculty members.
2. Requests are stored in a **MySQL database**.
3. **Faculty** log in to their dashboard to view requests.
4. Faculty can **accept** or **reject** requests.
5. Status updates are saved back to the database and reflected on both dashboards.

## 🛠️ Setup Instructions

1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/faculty-appointment-scheduler.git
cd faculty-appointment-scheduler

2️⃣ Install dependencies

npm install

3️⃣ Configure MySQL database

Create a database in MySQL:
CREATE DATABASE faculty_scheduler;
USE faculty_scheduler;

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100),
  faculty_name VARCHAR(100),
  date DATE,
  time TIME,
  status VARCHAR(20) DEFAULT 'Pending'
);
Then edit db.js:
import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password",
  database: "faculty_scheduler",
});

4️⃣ Run the server
node server.js
If successful, the console should show:
Server running at http://localhost:3000
MySQL Connected...

##Future Enhancements

✅ Authentication system for students & faculty

✅ Real-time notifications using Socket.io

✅ Faculty calendar view

✅ Appointment history & reports

✅ Email/SMS alerts on request updates

##👩‍💻 Author

Kanupriya Patsariya
📧 kanupriyapastariya2@gmail.com
💼 https://github.com/kanupriya0001

