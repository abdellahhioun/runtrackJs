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
// Registration route
app.post('/register', (req, res) => {
    const { email, password, role = 'user' } = req.body; // Default role is 'user'

    // Load users from the JSON file
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }

        const usersData = JSON.parse(data);
        const users = usersData.users;

        // Check if the user already exists
        if (users.find(u => u.email === email)) {
            return res.json({ status: 'error', message: 'User already exists' });
        }

        // Add new user
        users.push({ email, password, role });

        // Save updated users back to the JSON file
        fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(usersData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Internal server error' });
            }
            return res.json({ status: 'success', message: 'User registered successfully' });
        });
    });
});

// Route to get all users
app.get('/get_users', (req, res) => {
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
        const users = JSON.parse(data).users;
        return res.json(users); // Send users as JSON response
    });
});

// Update user role route
app.post('/update_role', (req, res) => {
    const { email, role } = req.body;
    console.log(`Received request to update role for email: "${email}" with role: "${role}"`); // Log the email and role

    // Load users from the JSON file
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }

        const usersData = JSON.parse(data);
        const users = usersData.users;

        // Log the users for debugging
        console.log('Current users:', users);

        // Find the user and update the role
        const user = users.find(u => u.email.trim() === email.trim()); // Trim spaces
        if (user) {
            user.role = role; // Update the user's role
            // Save updated users back to the JSON file
            fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(usersData, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ status: 'error', message: 'Internal server error' });
                }
                return res.json({ status: 'success', message: 'User role updated successfully' });
            });
        } else {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
