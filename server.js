const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ================= DB =================
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

// ================= USER =================
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
});
const User = mongoose.model("User", userSchema);

// ================= BOOK =================
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  category: String,
  stock: Number
});
const Book = mongoose.model("Book", bookSchema);

// ================= ISSUE (BORROW SYSTEM) =================
const issueSchema = new mongoose.Schema({
  userId: String,
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  fromDate: String,
  toDate: String,
  returned: { type: Boolean, default: false }
});
const Issue = mongoose.model("Issue", issueSchema);

// ================= HOME =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.send("User already exists");

    await User.create({
      username,
      email,
      password,
      role: "student"
    });

    res.send("Registered successfully");
  } catch (err) {
    res.status(500).send("Registration error");
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      user: user
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// ================= BOOK APIs =================
app.post("/addBook", async (req, res) => {
  try {
    await Book.create(req.body);
    res.send("Book added");
  } catch (err) {
    res.status(500).send("Error adding book");
  }
});

app.get("/getBooks", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send("Error fetching books");
  }
});

app.delete("/deleteBook/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send("Error deleting");
  }
});

// ================= BORROW BOOKS =================
app.post("/borrowBooks", async (req, res) => {
  try {
    const { userId, bookIds, fromDate, toDate } = req.body;

    for (let id of bookIds) {
      await Issue.create({
        userId,
        bookId: id,
        fromDate,
        toDate
      });
    }

    res.send("Books borrowed");
  } catch (err) {
    res.status(500).send("Borrow error");
  }
});

// ================= MY BOOKS =================
app.get("/myBooks/:userId", async (req, res) => {
  try {
    const issues = await Issue.find({
      userId: req.params.userId,
      returned: false
    }).populate("bookId");

    res.json(issues);
  } catch (err) {
    res.status(500).send("Error fetching my books");
  }
});

// ================= RETURN BOOK =================
app.put("/returnBook/:id", async (req, res) => {
  try {
    await Issue.findByIdAndUpdate(req.params.id, { returned: true });
    res.send("Book returned");
  } catch (err) {
    res.status(500).send("Return error");
  }
});

// ================= HISTORY =================
app.get("/history/:userId", async (req, res) => {
  try {
    const issues = await Issue.find({
      userId: req.params.userId
    }).populate("bookId");

    res.json(issues);
  } catch (err) {
    res.status(500).send("History error");
  }
});

// ================= CREATE ADMIN =================
app.get("/createAdmin", async (req, res) => {
  const exists = await User.findOne({ email: "admin@gmail.com" });

  if (exists) return res.send("Admin already exists");

  await User.create({
    username: "Admin",
    email: "admin@gmail.com",
    password: "123",
    role: "admin"
  });

  res.send("Admin created");
});

// ================= START =================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});