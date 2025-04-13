// Check login and display user information
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
if (currentUser) {
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
            const logoutModal = new bootstrap.Modal(document.getElementById('notificationModal'));
            document.getElementById('notificationMessage').textContent = 'Are you sure you want to logout?';
            logoutModal.show();
            
            // Handle confirm logout
            document.getElementById('confirmLogout').addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.href = '../HTML/login.html';
            });
        });
    }
}