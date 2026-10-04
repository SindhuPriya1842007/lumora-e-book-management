const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// DATA FILES
// ===============================

const dataPath = path.join(__dirname, "..", "backend", "data");

const usersFile = path.join(dataPath, "users.json");
const booksFile = path.join(dataPath, "books.json");
const issuesFile = path.join(dataPath, "issues.json");


// ===============================
// HELPERS
// ===============================

function readData(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
        return [];
    }
}

function writeData(file, data) {
    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2)
    );
}


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Lumora API is running"
    });
});


// ===============================
// USERS
// ===============================

app.post("/api/register", (req, res) => {

    const users = readData(usersFile);

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password
    };

    users.push(newUser);

    writeData(usersFile, users);

    res.status(201).json({
        message: "Registration successful",
        user: newUser
    });
});


app.post("/api/login", (req, res) => {

    const users = readData(usersFile);

    const {
        email,
        password
    } = req.body;

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user
    });
});


app.get("/api/users", (req, res) => {

    const users = readData(usersFile);

    res.json(users);
});


// ===============================
// BOOKS
// ===============================

app.get("/api/books", (req, res) => {

    const books = readData(booksFile);

    res.json(books);
});


app.get("/api/books/:id", (req, res) => {

    const books = readData(booksFile);

    const book = books.find(
        book => String(book.id) === String(req.params.id)
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});


app.post("/api/books", (req, res) => {

    const books = readData(booksFile);

    const {
        title,
        author,
        category,
        rating,
        copies,
        description
    } = req.body;

    if (!title || !author || !category) {
        return res.status(400).json({
            message: "Title, author and category are required"
        });
    }

    const newBook = {
        id: Date.now(),
        title,
        author,
        category,
        rating: Number(rating) || 0,
        available: Number(copies) > 0,
        copies: Number(copies) || 0,
        description: description || ""
    };

    books.push(newBook);

    writeData(booksFile, books);

    res.status(201).json(newBook);
});


app.delete("/api/books/:id", (req, res) => {

    const books = readData(booksFile);

    const filteredBooks = books.filter(
        book => String(book.id) !== String(req.params.id)
    );

    if (books.length === filteredBooks.length) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    writeData(booksFile, filteredBooks);

    res.json({
        message: "Book deleted successfully"
    });
});


// ===============================
// ISSUES
// ===============================

app.post("/api/issues", (req, res) => {

    const issues = readData(issuesFile);
    const books = readData(booksFile);

    const {
        studentName,
        registrationNumber,
        bookId,
        bookTitle,
        author,
        category,
        issueDate,
        returnDate,
        comments
    } = req.body;

    const book = books.find(
        book => String(book.id) === String(bookId)
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (Number(book.copies) <= 0) {
        return res.status(400).json({
            message: "Book is currently unavailable"
        });
    }

    const issue = {
        id: Date.now(),

        studentName,
        registrationNumber,

        bookId: book.id,
        bookTitle: bookTitle || book.title,
        author: author || book.author,
        category: category || book.category,

        issueDate,
        returnDate,
        comments: comments || "",

        status: "Pending OTP",

        otp: null,
        returnedDate: null,
        fine: 0
    };

    issues.push(issue);

    book.copies = Number(book.copies) - 1;
    book.available = book.copies > 0;

    writeData(issuesFile, issues);
    writeData(booksFile, books);

    res.status(201).json(issue);
});


app.get("/api/issues", (req, res) => {

    const issues = readData(issuesFile);

    res.json(issues);
});


app.get("/api/issues/:id", (req, res) => {

    const issues = readData(issuesFile);

    const issue = issues.find(
        issue => String(issue.id) === String(req.params.id)
    );

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    res.json(issue);
});


// ===============================
// OTP
// ===============================

app.post("/api/issues/:id/send-otp", (req, res) => {

    const issues = readData(issuesFile);

    const issue = issues.find(
        issue => String(issue.id) === String(req.params.id)
    );

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    const otp =
        Math.floor(100000 + Math.random() * 900000).toString();

    issue.otp = otp;

    writeData(issuesFile, issues);

    res.json({
        message: "OTP generated",
        otp
    });
});


app.post("/api/issues/:id/verify-otp", (req, res) => {

    const issues = readData(issuesFile);

    const issue = issues.find(
        issue => String(issue.id) === String(req.params.id)
    );

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    const { otp } = req.body;

    if (String(issue.otp) !== String(otp)) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    issue.status = "Issued";
    issue.otp = null;

    writeData(issuesFile, issues);

    res.json({
        message: "OTP verified successfully",
        issue
    });
});


// ===============================
// RETURN BOOK
// ===============================

app.post("/api/issues/:id/return", (req, res) => {

    const issues = readData(issuesFile);
    const books = readData(booksFile);

    const issue = issues.find(
        issue => String(issue.id) === String(req.params.id)
    );

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    if (issue.status === "Returned") {
        return res.status(400).json({
            message: "Book already returned"
        });
    }

    const today = new Date();

    const expectedReturn =
        new Date(issue.returnDate);

    let fine = 0;

    if (today > expectedReturn) {

        const difference =
            today.getTime() - expectedReturn.getTime();

        const lateDays =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );

        fine = lateDays * 10;
    }

    issue.status = "Returned";
    issue.returnedDate =
        today.toISOString().split("T")[0];

    issue.fine = fine;

    const book = books.find(
        book => String(book.id) === String(issue.bookId)
    );

    if (book) {

        book.copies =
            Number(book.copies) + 1;

        book.available =
            book.copies > 0;
    }

    writeData(issuesFile, issues);
    writeData(booksFile, books);

    res.json({
        message: "Book returned successfully",
        fine,
        issue
    });
});


// ===============================
// EXPORT FOR VERCEL
// ===============================

module.exports = app;