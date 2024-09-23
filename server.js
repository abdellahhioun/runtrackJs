const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
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
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Signup route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const domain = email.split('@')[1];

    if (domain !== 'laplateforme.io') {
        return res.json({ success: false, message: 'Invalid email domain' });
    }

    try {
        const hashedPassword = await hashPassword(password);
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

// Sign-in route
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error' });
        }
        if (results.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.json({ success: true, userId: user.id });
        } else {
            res.json({ success: false, message: 'Invalid password' });
        }
    });
});

// Attendance request route
app.post('/attendance-request', (req, res) => {
    const { userId, requestDate } = req.body;

    const today = new Date();
    const selectedDate = new Date(requestDate);
    if (selectedDate < today) {
        return res.json({ success: false, message: 'Cannot request attendance for a past date' });
    }

    const sql = 'INSERT INTO attendance_requests (user_id, request_date) VALUES (?, ?)';
    db.query(sql, [userId, requestDate], (err, result) => {
        if (err) {
            return res.json({ success: false, message: 'Database error' });
        }
        res.json({ success: true });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
