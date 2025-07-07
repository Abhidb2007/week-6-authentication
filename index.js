const express = require("express");
const app = express();
const users = [];
app.post("/signup", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    users.push({
        username: username,
        password: password

    })
    res.json({
        message:"you have signed in",
    })

    

})
app.post("/signin",function(req, res){
    
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});