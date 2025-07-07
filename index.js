const express = require("express");
const app = express();
app.post("/signup", function(req, res){
    res.json({
        message: "User signed up successfully"})

})
app.post("/signin",function(req, res){
    
})

app.listen(3000);