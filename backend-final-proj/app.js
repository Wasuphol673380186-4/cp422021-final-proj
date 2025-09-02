const express = require("express")

const app = express()


app.use(express.urlencoded({extended: true}));
app.use(express.json());


const register = (req, res, next) => {
    
    console.log(req.body);
}



app.post("/register", register)






app.listen(3000, () => {
    console.log("Listening on port 3000 !")
})