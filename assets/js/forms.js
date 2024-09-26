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
                switch (data.role) {
                    case 'admin':
                        window.location.href = 'admin.html'; // Redirect to admin dashboard
                        break;
                    case 'moderator':
                        window.location.href = 'moderator.html'; // Redirect to moderator dashboard
                        break;
                    case 'user':
                        window.location.href = 'user_dashboard.html'; // Redirect to user dashboard
                        break;
                    default:
                        window.location.href = 'index.html'; // Fallback
                }
            } else {
                alert(data.message); // Show error message
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
