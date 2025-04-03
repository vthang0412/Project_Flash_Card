// Check login and display user information
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Display user information
    const usernameElement = document.getElementById('username');
    const welcomeHeading = document.querySelector('.container h1');
    
    if (usernameElement) {
        usernameElement.textContent = `Hi, ${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome back to learning, ${currentUser.firstName} ${currentUser.lastName}!`;
    }

    // Handle logout
    const logoutButton = document.querySelector('.btn.btn-danger');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            const confirmLogout = confirm('Are you sure you want to logout?');
            if (confirmLogout) {
                localStorage.removeItem('currentUser');
                window.location.href = '../HTML/login.html';
            }
        });
    }
});