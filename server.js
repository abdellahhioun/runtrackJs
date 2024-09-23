const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import CORS
const bcrypt = require('bcrypt'); // Import bcrypt

const app = express();
app.use(cors()); // Use CORS middleware
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'laplateforme'
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// Function to hash password using bcrypt
async function hashPassword(password) {
    const saltRounds = 10; // You can adjust the cost factor
    return await bcrypt.hash(password, saltRounds);
}

// Signup route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const domain = email.split('@')[1];

    // Validate email domain
    if (domain !== 'laplateforme.io') {
        return res.json({ success: false, message: 'Invalid email domain' });
    }

    try {
        const hashedPassword = await hashPassword(password); // Hash the password

        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error' });
            }
            res.json({ success: true });
        });
    } catch (error) {
        return res.json({ success: false, message: 'Error hashing password' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
