const express = require("express")

const app = express()


app.use(express.urlencoded({extended: true}));
app.use(express.json());

const caCert = fs.readFileSync(__dirname + '/ca.pem');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

});

const register = (req, res, next) => {
    
    console.log(req.body);
}



app.post("/register", register)






app.listen(3000, () => {
    console.log("Listening on port 3000 !")
})