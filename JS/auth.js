document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    // Register form handling
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const firstName = document.getElementById("firstName");
            const lastName = document.getElementById("lastName");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");

            const firstNameFeedback = document.querySelector("#firstName + .invalid-feedback");
            const lastNameFeedback = document.querySelector("#lastName + .invalid-feedback");
            const emailFeedback = document.querySelector("#email + .invalid-feedback");
            const passwordFeedback = document.querySelector("#password + .invalid-feedback");
            const confirmPasswordFeedback = document.querySelector("#confirmPassword + .invalid-feedback");

            let isValid = true;
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // First name validation
            if (!firstName.value.trim()) {
                firstName.classList.add("is-invalid");
                firstNameFeedback.textContent = "Please provide a valid first name.";
                firstNameFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                firstName.classList.remove("is-invalid");
                firstNameFeedback.classList.add("hidden");
            }

            // Last name validation
            if (!lastName.value.trim()) {
                lastName.classList.add("is-invalid");
                lastNameFeedback.textContent = "Please provide a valid last name.";
                lastNameFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                lastName.classList.remove("is-invalid");
                lastNameFeedback.classList.add("hidden");
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmailUnique = !users.some(user => user.email === email.value.trim());

            if (!email.value.trim()) {
                email.classList.add("is-invalid");
                emailFeedback.textContent = "Please provide a valid email address.";
                emailFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!emailRegex.test(email.value.trim())) {
                email.classList.add("is-invalid");
                emailFeedback.textContent = "Invalid email format.";
                emailFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!isEmailUnique) {
                email.classList.add("is-invalid");
                emailFeedback.textContent = "This email is already registered.";
                emailFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                email.classList.remove("is-invalid");
                emailFeedback.classList.add("hidden");
            }

            // Password validation
            const pwd = password.value;
            if (!pwd.trim()) {
                password.classList.add("is-invalid");
                passwordFeedback.textContent = "Password cannot be empty.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else if (pwd.length < 8) {
                password.classList.add("is-invalid");
                passwordFeedback.textContent = "Password must be at least 8 characters long.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!/[A-Z]/.test(pwd)) {
                password.classList.add("is-invalid");
                passwordFeedback.textContent = "Password must contain at least one uppercase letter.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!/[a-z]/.test(pwd)) {
                password.classList.add("is-invalid");
                passwordFeedback.textContent = "Password must contain at least one lowercase letter.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!/[0-9]/.test(pwd)) {
                password.classList.add("is-invalid");
                passwordFeedback.textContent = "Password must contain at least one number.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                password.classList.remove("is-invalid");
                passwordFeedback.classList.add("hidden");
            }

            // Confirm password
            if (!confirmPassword.value.trim()) {
                confirmPassword.classList.add("is-invalid");
                confirmPasswordFeedback.textContent = "Confirm Password cannot be empty.";
                confirmPasswordFeedback.classList.remove("hidden");
                isValid = false;
            } else if (confirmPassword.value !== password.value) {
                confirmPassword.classList.add("is-invalid");
                confirmPasswordFeedback.textContent = "Passwords do not match.";
                confirmPasswordFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                confirmPassword.classList.remove("is-invalid");
                confirmPasswordFeedback.classList.add("hidden");
            }

            if (!isValid) return;

            // Save new user
            users.push({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                password: password.value,
            });

            localStorage.setItem("users", JSON.stringify(users));

            showNotification("Registration successful! Redirecting to login page...", function () {
                window.location.href = "login.html";
            });
        });
    }

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");

            const emailFeedback = document.querySelector("#loginEmail + .invalid-feedback");
            const passwordFeedback = document.querySelector("#loginPassword + .invalid-feedback");

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.email === email);

            let isValid = true;

            if (!email) {
                emailInput.classList.add("is-invalid");
                emailFeedback.textContent = "Email cannot be empty.";
                emailFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!user) {
                emailInput.classList.add("is-invalid");
                emailFeedback.textContent = "Invalid email or password.";
                emailFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                emailInput.classList.remove("is-invalid");
                emailFeedback.classList.add("hidden");
            }

            if (!password) {
                passwordInput.classList.add("is-invalid");
                passwordFeedback.textContent = "Password cannot be empty.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else if (!user || user.password !== password) {
                passwordInput.classList.add("is-invalid");
                passwordFeedback.textContent = "Invalid email or password.";
                passwordFeedback.classList.remove("hidden");
                isValid = false;
            } else {
                passwordInput.classList.remove("is-invalid");
                passwordFeedback.classList.add("hidden");
            }

            if (!isValid) return;

            localStorage.setItem("currentUser", JSON.stringify(user));

            showNotification("Login successful! Redirecting to dashboard...", function () {
                window.location.href = "dashboard.html";
            });
        });
    }
});
// Function to show notification modal
function showNotification(message, callback) {
    const modalElement = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationModal = new bootstrap.Modal(modalElement);

    notificationMessage.textContent = message;

    const handler = function () {
        modalElement.removeEventListener('hidden.bs.modal', handler);
        if (callback) callback();
    };

    modalElement.addEventListener('hidden.bs.modal', handler);
    notificationModal.show();
}