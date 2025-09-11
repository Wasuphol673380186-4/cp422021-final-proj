const express = require("express")
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const app = express()


app.use(express.urlencoded({extended: true}));
app.use(express.json());

const caCert = fs.readFileSync(__dirname + '/ca.pem');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


const register = async (req, res, next) => {
    const { firstname, lastname, email, phone, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).send('Please provide all required fields: firstname, lastname, email, password');
    }

    try {
        // Check if email already exists
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).send('Email already registered.');
        }

        // Hash password (you should use a proper hashing library like bcrypt)
        // For demonstration, we'll store it as plain text. DO NOT do this in production.
        const hashedPassword = password; // In a real app: await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (firstname, lastname, email, phone, password) VALUES (?, ?, ?, ?, ?)',
            [firstname, lastname, email, phone, hashedPassword]
        );

        res.status(201).send(`User registered with ID: ${result.insertId}`);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Registration failed: ' + error.message);
    }
}

app.post("/register", register)

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please provide both email and password');
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = users[0];
        
        // In a real app, you should use bcrypt.compare() here
        if (password !== user.password) {
            return res.status(401).send('Invalid email or password');
        }

        res.status(200).send(`Login successful! Welcome ${user.firstname} ${user.lastname}`);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Login failed: ' + error.message);
    }
});

app.get('/test-db-connection', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        res.status(200).send('Database connection successful!');
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send('Database connection failed: ' + error.message);
    }
});



app.post("/register", register)






app.listen(3000, () => {
    console.log("Listening on port 3000 !")
})