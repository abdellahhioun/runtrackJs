const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // To parse JSON body

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve assets from the assets folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve styles from the styles folder
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Serve JavaScript files
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Load users from the JSON file
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }

        const users = JSON.parse(data).users;
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            return res.json({ status: 'success', role: user.role });
        } else {
            return res.json({ status: 'error', message: 'Invalid email or password' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
