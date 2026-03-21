const Issue = require('./models/issue');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Book = require('./models/Book');   // ✅ fixed capital
const User = require('./models/User');   // ✅ fixed capital

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/libraryDB');
        console.log("MongoDB Connected");
    } catch (err) {
        console.log("MongoDB Error:", err);
    }
}

connectDB();

// Test Route
app.get('/', (req, res) => {
    res.send("Server is running");
});


// ================= ADMIN CREATE =================
app.post('/createAdmin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ role: "admin" });

        if (adminExists) {
            return res.send("Admin already exists");
        }

        const admin = new User({
            username: "admin",
            email: "admin@gmail.com",
            password: "123",
            role: "admin"
        });

        await admin.save();

        res.send("Admin created successfully");
    } catch (err) {
        console.log("Error:", err);
        res.send("Error creating admin");
    }
});


// ================= LOGIN =================
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.send("Invalid credentials");
        }

        res.json({
            message: "Login successful",
            role: user.role,
            user: user
        });

    } catch (err) {
        console.log(err);
        res.send("Login error");
    }
});


// ================= ADD BOOK =================
app.post('/addBook', async (req, res) => {
    try {
        const { title, author, category, stock } = req.body;

        const newBook = new Book({
            title,
            author,
            category,
            stock
        });

        await newBook.save();

        res.send("Book added successfully");
    } catch (err) {
        console.log(err);
        res.send("Error adding book");
    }
});


// ================= GET BOOKS =================
app.get('/getBooks', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.log(err);
        res.send("Error fetching books");
    }
});


// ================= DELETE BOOK =================
app.delete('/deleteBook/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await Book.findByIdAndDelete(id);

        res.send("Book deleted successfully");
    } catch (err) {
        console.log(err);
        res.send("Error deleting book");
    }
});


// ================= START SERVER =================
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, enroll } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("User already exists");
        }

        const newUser = new User({
            username,
            email,
            password,
            enroll,
            role: "student"
        });

        await newUser.save();

        res.send("Student registered successfully");
    } catch (err) {
        console.log(err);
        res.send("Error registering");
    }
});
app.post('/issueBook', async (req, res) => {
    try {
        const { studentId, bookId, fromDate, toDate } = req.body;

        const issue = new Issue({
            studentId,
            bookId,
            fromDate,
            toDate
        });

        await issue.save();

        console.log("Saved:", issue);   // ✅ DEBUG

        res.send("Book issued successfully");
    } catch (err) {
        console.log(err);
        res.send("Error issuing book");
    }
});
app.get('/myBooks/:studentId', async (req, res) => {
    try {
        const issues = await Issue.find({
            studentId: req.params.studentId,
            returned: false
        });

        const result = [];

        for (let issue of issues) {
            const book = await Book.findById(issue.bookId);

            result.push({
                _id: issue._id,
                title: book ? book.title : "Unknown",
                fromDate: issue.fromDate,
                toDate: issue.toDate
            });
        }

        res.json(result);
    } catch (err) {
        console.log(err);
        res.send("Error fetching");
    }
});
app.put('/returnBook/:id', async (req, res) => {
    try {
        await Issue.findByIdAndUpdate(req.params.id, {
            returned: true
        });

        res.send("Book returned");
    } catch (err) {
        console.log(err);
        res.send("Error returning book");
    }
});
app.get('/history/:studentId', async (req, res) => {
    try {
        const issues = await Issue.find({
            studentId: req.params.studentId,
            returned: true
        });

        const result = [];

        for (let issue of issues) {
            const book = await Book.findById(issue.bookId);

            result.push({
                title: book ? book.title : "Unknown",
                fromDate: issue.fromDate,
                toDate: issue.toDate
            });
        }

        res.json(result);
    } catch (err) {
        console.log(err);
        res.send("Error fetching history");
    }
});
app.post('/sendOtp', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User not found");
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        console.log("OTP:", otp);

        res.json({
            message: "OTP sent",
            otp: otp   // ✅ THIS IS IMPORTANT
        });

    } catch (err) {
        console.log(err);
        res.send("Error sending OTP");
    }
});
app.post('/resetPassword', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User not found");
        }

        if (user.otp !== otp) {
            return res.send("Invalid OTP");
        }

        if (new Date() > user.otpExpiry) {
            return res.send("OTP expired");
        }

        user.password = newPassword;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.send("Password updated successfully");
    } catch (err) {
        console.log(err);
        res.send("Error resetting password");
    }
});