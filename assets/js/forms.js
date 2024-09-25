// js/forms.js

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Gather form data
        const email = this.email.value;
        const password = this.password.value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Redirect based on the user's role
                window.location.href = data.role === 'admin' ? 'admin.html' : 'moderator.html';
            } else {
                alert(data.message); // Show error message
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
