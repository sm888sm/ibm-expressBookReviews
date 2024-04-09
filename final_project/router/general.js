const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    users[username] = { username, password };

    res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    })
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    new Promise((resolve, reject) => {
        const book = books[req.params.isbn];
        if (book) {
            resolve(book);
        } else {
            reject("No book found with this ISBN");
        }
    })
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(
            (book) => book.author === req.params.author
        );
        if (booksByAuthor.length) {
            resolve(booksByAuthor);
        } else {
            reject("No books found by this author");
        }
    })
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    new Promise((resolve, reject) => {
        const booksByTitle = Object.values(books).filter(
            (book) => book.title === req.params.title
        );
        if (booksByTitle.length) {
            resolve(booksByTitle);
        } else {
            reject("No books found with this title");
        }
    })
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
    const book = books[req.params.isbn];
    if (book) {
        const reviews = book.reviews;
        if (reviews) {
            res.json(reviews);
        } else {
            res.status(404).json({ message: "No reviews found for this book" });
        }
    } else {
        res.status(404).json({ message: "No book found with this ISBN" });
    }
});


module.exports.general = public_users;
