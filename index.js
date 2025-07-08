const express = require("express");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const users = [];

function generateToken() {
    const options = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = "";
    for (let i = 0; i < 32; i++) {
        token += options[Math.floor(Math.random() * options.length)];
    }
    return token;
}

app.post("/signup", function(req, res) {
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

    // Check if user already exists
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

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = generateToken();
        user.token = token;
        res.json({
            message: "Login successful",
            token: token
        });
        
    } else {
        res.status(403).json({
            message: "Invalid username or password"
        });
    }
    console.log(users); 
});

app.get("/me", (req, res) => {
    const token = req.headers.token;
    const foundUser = null;
    for(let i=0;i<users.length;i++){
        if(users[i].token == token){
            foundUser = users[i];
        
        }
    }
    if(foundUser){
        res.json({
            username: foundUser.username,
            password: foundUser.password
        

        })

    }else{
        res.json({
            message:"token invalid"

        })
    }
});
// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
