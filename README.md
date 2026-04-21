# 📚 AI Library Management System

A full-stack web application to manage library operations including book management, user authentication, and book borrowing system.

---

## 🚀 Features

### 👨‍💼 Admin

* Add new books
* View all books
* Delete books
* Manage library inventory

### 👨‍🎓 Student

* Register & Login
* Browse available books
* Borrow multiple books
* View borrowed books
* Return books
* View borrowing history

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)

---

## 📂 Project Structure

```
AI_LIBRARY_MANAGEMENT/
│
├── server.js
├── package.json
├── node_modules/
│
├── login.html
├── register.html
├── admin.html
├── student.html
├── modern-style.css
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/tharunyadavb-sys/library-management-system-.git
cd ai-library-management
```

### 2️⃣ Install dependencies

```
npm install
```

### 3️⃣ Start MongoDB

Make sure MongoDB is running on:

```
mongodb://127.0.0.1:27017
```

### 4️⃣ Run the server

```
node server.js
```

### 5️⃣ Open in browser

```
http://localhost:3000
```

---

## 🔐 Default Admin Login

```
Email: admin@gmail.com
Password: 123
```

Create admin by visiting:

```
http://localhost:3000/createAdmin
```

---

## 📌 API Endpoints

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | /register        | Register user      |
| POST   | /login           | Login user         |
| POST   | /addBook         | Add book           |
| GET    | /getBooks        | Get all books      |
| DELETE | /deleteBook/:id  | Delete book        |
| POST   | /borrowBooks     | Borrow books       |
| GET    | /myBooks/:userId | Get borrowed books |
| PUT    | /returnBook/:id  | Return book        |
| GET    | /history/:userId | Borrow history     |

---

## 🚀 Future Enhancements

* JWT Authentication (secure login)
* Book availability tracking
* Notifications system
* Online deployment

---

## 👨‍💻 Author

**Tharun**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
