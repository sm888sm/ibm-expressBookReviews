const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const SECRET = "fingerprint_customer";

let users = [];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	return users.some(
		(user) => user.username === username && user.password === password
	);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Authenticate the user, for example by checking a database
    const user = users[username];

    if (user && user.password === password) {
        // If the user is authenticated, sign a JWT
        const token = jwt.sign({ username }, SECRET);

        // Store the token in the session
        req.session.token = token;

        res.status(200).json({ message: "Logged in successfully" });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { review } = req.body;
    const { username } = req.user;
    if (users[username]) {
        const book = books[req.params.isbn];
        if (book) {
            book.reviews[username] = review;
            res.status(200).json({ message: "Review added/updated successfully" });
        } else {
            res.status(400).json({ message: "No book found with this ISBN" });
        }
    } else {
        res.status(400).json({ message: "Invalid username" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.user;
    if (users[username]) {
        const book = books[req.params.isbn];
        if (book) {
            if (book.reviews[username]) {
                delete book.reviews[username];
                res.status(200).json({ message: "Review deleted successfully" });
            } else {
                res.status(400).json({ message: "No review found from this user for this book" });
            }
        } else {
            res.status(400).json({ message: "No book found with this ISBN" });
        }
    } else {
        res.status(400).json({ message: "Invalid username" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
