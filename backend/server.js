const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "data");

const usersFile = path.join(dataPath, "users.json");
const booksFile = path.join(dataPath, "books.json");
const issuesFile = path.join(dataPath, "issues.json");

function readJSON(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "[]");
    }

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// HOME
app.get("/", (req, res) => {
    res.send("Lumora Backend is running!");
});


// =========================
// AUTH
// =========================

app.post("/api/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const users = readJSON(usersFile);

    const existingUser = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return res.status(400).json({
            message: "Email already registered"
        });
    }

    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password
    };

    users.push(newUser);
    writeJSON(usersFile, users);

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: newUser.id,
            firstName,
            lastName,
            email
        }
    });
});


app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    const users = readJSON(usersFile);

    const user = users.find(
        user =>
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    });
});


// =========================
// USERS - ADMIN
// =========================

app.get("/api/users", (req, res) => {
    const users = readJSON(usersFile);

    const safeUsers = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }));

    res.json(safeUsers);
});


// =========================
// BOOKS
// =========================

app.get("/api/books", (req, res) => {
    const books = readJSON(booksFile);
    res.json(books);
});


app.get("/api/books/:id", (req, res) => {
    const books = readJSON(booksFile);

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


// ADD BOOK - ADMIN
app.post("/api/books", (req, res) => {
    const { title, author, category, rating, copies, description } = req.body;

    if (!title || !author || !category) {
        return res.status(400).json({
            message: "Title, author and category are required"
        });
    }

    const books = readJSON(booksFile);

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
    writeJSON(booksFile, books);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


// DELETE BOOK - ADMIN
app.delete("/api/books/:id", (req, res) => {
    const books = readJSON(booksFile);

    const index = books.findIndex(
        book => String(book.id) === String(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);
    writeJSON(booksFile, books);

    res.json({
        message: "Book deleted successfully"
    });
});


// =========================
// ISSUE BOOK
// =========================

app.post("/api/issues", (req, res) => {
    const {
        studentName,
        registrationNumber,
        bookId,
        issueDate,
        returnDate,
        comments
    } = req.body;

    if (
        !studentName ||
        !registrationNumber ||
        !bookId ||
        !issueDate ||
        !returnDate
    ) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    const books = readJSON(booksFile);
    const issues = readJSON(issuesFile);

    const book = books.find(
        book => String(book.id) === String(bookId)
    );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.copies <= 0) {
        return res.status(400).json({
            message: "Book is currently unavailable"
        });
    }

    const newIssue = {
        id: Date.now(),
        studentName,
        registrationNumber,
        bookId: book.id,
        bookTitle: book.title,
        author: book.author,
        category: book.category,
        issueDate,
        returnDate,
        comments: comments || "",
        status: "Pending OTP",
        otp: null,
        otpVerified: false,
        returnedDate: null,
        fine: 0
    };

    issues.push(newIssue);

    // Reduce available copies
    book.copies -= 1;
    book.available = book.copies > 0;

    writeJSON(issuesFile, issues);
    writeJSON(booksFile, books);

    res.status(201).json({
        message: "Book issue request created",
        issue: newIssue
    });
});


// =========================
// GET ALL ISSUES - ADMIN
// =========================

app.get("/api/issues", (req, res) => {
    const issues = readJSON(issuesFile);
    res.json(issues);
});


// =========================
// GET SINGLE ISSUE
// =========================

app.get("/api/issues/:id", (req, res) => {
    const issues = readJSON(issuesFile);

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


// =========================
// SEND OTP
// =========================

app.post("/api/issues/:id/send-otp", (req, res) => {
    const issues = readJSON(issuesFile);

    const issue = issues.find(
        issue => String(issue.id) === String(req.params.id)
    );

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    issue.otp = otp;

    writeJSON(issuesFile, issues);

    res.json({
        message: "OTP generated",
        otp: otp
    });
});


// =========================
// VERIFY OTP
// =========================

app.post("/api/issues/:id/verify-otp", (req, res) => {
    const { otp } = req.body;

    const issues = readJSON(issuesFile);

    const issue = issues.find(
        issue => String(issue.id) === String(req.params.id)
    );

    if (!issue) {
        return res.status(404).json({
            message: "Issue not found"
        });
    }

    if (issue.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    issue.otpVerified = true;
    issue.status = "Issued";

    writeJSON(issuesFile, issues);

    res.json({
        message: "OTP verified successfully",
        issue: issue
    });
});


// =========================
// RETURN BOOK
// =========================

app.post("/api/issues/:id/return", (req, res) => {
    const issues = readJSON(issuesFile);
    const books = readJSON(booksFile);

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
            message: "Book has already been returned"
        });
    }

    const returnedDate = new Date();

    const dueDate = new Date(issue.returnDate);

    const difference =
        returnedDate.setHours(0, 0, 0, 0) -
        dueDate.setHours(0, 0, 0, 0);

    const lateDays = Math.max(
        0,
        Math.ceil(difference / (1000 * 60 * 60 * 24))
    );

    const fine = lateDays * 10;

    issue.returnedDate = new Date().toISOString().split("T")[0];
    issue.fine = fine;
    issue.status = "Returned";

    const book = books.find(
        book => String(book.id) === String(issue.bookId)
    );

    if (book) {
        book.copies += 1;
        book.available = true;
    }

    writeJSON(issuesFile, issues);
    writeJSON(booksFile, books);

    res.json({
        message: "Book returned successfully",
        fine,
        lateDays,
        issue
    });
});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log(`Lumora Backend running on http://localhost:${PORT}`);
});