const express = require("express");
const jwt = require("jsonwebtoken"); // <-- You forgot to import this
const app = express();

app.use(express.json());

// Replace with your own secret key
const JWT_SECRET = "my-secret-key";

const users = [];

function generateToken() {
    const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = "";
    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (username.length < 5) {
        return res.json({
            message: "Your username is very short"
        });
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    res.json({
        message: "You have signed up successfully"
    });
});

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (foundUser) {
        const token = jwt.sign(
            { username: foundUser.username },
            JWT_SECRET
        );
        // Save the token in the user object
        foundUser.token = token;

        return res.json({
            token: token,
        });
    }

    // Only send error response if user not found
    res.status(403).json({
        message: "Invalid username or password"
    });
});

app.get("/me", (req, res) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Token required" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // <-- verify token
        const foundUser = users.find(user => user.username === decoded.username && user.token === token);

        if (foundUser) {
            res.json({
                username: foundUser.username,
                password: foundUser.password
            });
        } else {
            res.status(403).json({ message: "Token invalid or user not found" });
        }
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});

// Start the server
app.listen(4000, () => {
    console.log("Server is running on http://localhost:3000");
});
