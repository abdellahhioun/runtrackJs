// Simulated JSON data (replace with actual API calls in a real application)
let users = [];
let presenceRequests = [];

// DOM elements
const app = document.getElementById('app');
const authForm = document.getElementById('authForm');
const switchAuthModeBtn = document.getElementById('switchAuthMode');
const loginBtn = document.getElementById('loginBtn');

// Current user
let currentUser = null;

// Authentication mode (login or register)
let isLoginMode = true;

// Initialize the application
function init() {
    updateNavigation();
    setupEventListeners();
    showPage('home');
}

// Setup event listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', () => showPage('auth'));
    authForm.addEventListener('submit', handleAuth);
    switchAuthModeBtn.addEventListener('click', toggleAuthMode);
    
    // Add event listeners for navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(e.target.dataset.page);
        });
    });
}

// Show the specified page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';

    if (pageId === 'calendar' && currentUser) {
        initializeCalendar();
    } else if (pageId === 'admin' && currentUser && currentUser.role === 'admin') {
        loadAdminData();
    }
}

// Handle authentication (login or register)
function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isLoginMode) {
        login(email, password);
    } else {
        register(email, password);
    }
}

// Toggle between login and register modes
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    authForm.querySelector('button[type="submit"]').textContent = isLoginMode ? 'Se connecter' : 'S\'inscrire';
    switchAuthModeBtn.textContent = isLoginMode ? 'S\'inscrire' : 'Se connecter';
}

// Register a new user
function register(email, password) {
    if (!isValidEmail(email)) {
        alert('Seuls les membres de La Plateforme_ peuvent s\'inscrire.');
        return;
    }

    // In a real application, you would make an API call here
    const newUser = { email, password, role: 'user' };
    users.push(newUser);
    login(email, password);
}

// Log in a user
function login(email, password) {
    // In a real application, you would make an API call here
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        updateNavigation();
        showPage('home');
    } else {
        alert('Email ou mot de passe incorrect.');
    }
}

// Update navigation based on user role
function updateNavigation() {
    const adminNav = document.querySelector('.admin-only');
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator')) {
        adminNav.style.display = 'block';
    } else {
        adminNav.style.display = 'none';
    }

    loginBtn.textContent = currentUser ? 'Déconnexion' : 'Connexion';
    loginBtn.onclick = currentUser ? logout : () => showPage('auth');
}

// Log out the current user
function logout() {
    currentUser = null;
    updateNavigation();
    showPage('home');
}

// Validate email domain
function isValidEmail(email) {
    return email.endsWith('@laplateforme.io');
}

// Initialize the calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendarContainer');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        select: function(info) {
            if (info.start >= new Date()) {
                if (confirm(`Demander une autorisation de présence pour le ${info.startStr} ?`)) {
                    requestPresence(info.startStr);
                }
            } else {
                alert('Vous ne pouvez pas faire de demande pour une date passée.');
            }
            calendar.unselect();
        }
    });
    calendar.render();
}

// Request presence for a specific date
function requestPresence(date) {
    // In a real application, you would make an API call here
    presenceRequests.push({ user: currentUser.email, date, status: 'pending' });
    alert('Demande envoyée avec succès.');
}

// Load admin data
function loadAdminData() {
    const presenceRequestsTable = document.getElementById('presenceRequests');
    const userManagementTable = document.getElementById('userManagement');

    // Clear existing data
    presenceRequestsTable.innerHTML = '';
    userManagementTable.innerHTML = '';

    // Load presence requests
    presenceRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.user}</td>
            <td>${request.date}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="updatePresenceRequest('${request.user}', '${request.date}', 'approved')">Approuver</button>
                <button class="btn btn-sm btn-danger" onclick="updatePresenceRequest('${request.user}', '${request.date}', 'rejected')">Refuser</button>
            </td>
        `;
        presenceRequestsTable.appendChild(row);
    });

    // Load user management (only for admins)
    if (currentUser.role === 'admin') {
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.email.split('@')[0]}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <select onchange="updateUserRole('${user.email}', this.value)">
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Utilisateur</option>
                        <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Modérateur</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrateur</option>
                    </select>
                </td>
            `;
            userManagementTable.appendChild(row);
        });
    }
}

// Update presence request status
function updatePresenceRequest(user, date, status) {
    // In a real application, you would make an API call here
    const request = presenceRequests.find(r => r.user === user && r.date === date);
    if (request) {
        request.status = status;
        loadAdminData();
    }
}

// Update user role
function updateUserRole(email, newRole) {
    // In a real application, you would make an API call here
    const user = users.find(u => u.email === email);
    if (user) {
        user.role = newRole;
        loadAdminData();
    }
}

// Initialize the application
init();
