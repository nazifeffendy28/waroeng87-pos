document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const loginPage = document.getElementById('loginPage');
    const registerPage = document.getElementById('registerPage');
    const forgotPasswordPage = document.getElementById('forgotPasswordPage');
    const dashboardPage = document.getElementById('dashboardPage');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const logoutButton = document.getElementById('logoutButton');
    const userInfoUsername = document.getElementById('userInfoUsername');
    const fpUsernameOrEmail = document.getElementById('fpUsernameOrEmail');
    const newPasswordFields = document.getElementById('newPasswordFields');
    const fpNewPassword = document.getElementById('fpNewPassword');
    const fpConfirmPassword = document.getElementById('fpConfirmPassword');

    function showPage(pageId) {
        [loginPage, registerPage, forgotPasswordPage, dashboardPage].forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    }

    document.getElementById('showRegister').addEventListener('click', () => showPage('registerPage'));
    document.getElementById('showForgotPassword').addEventListener('click', () => showPage('forgotPasswordPage'));
    document.getElementById('showLogin').addEventListener('click', () => showPage('loginPage'));
    document.getElementById('showLoginFromForgotPassword').addEventListener('click', () => showPage('loginPage'));

    function checkPasswordStrength(password) {
        const strength = {
            0: "Low",
            1: "Medium",
            2: "Strong"
        };

        let score = 0;
        if (password.length > 6) score++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/)) score++;

        return strength[score];
    }

    function updatePasswordStrength(inputId, strengthId) {
        const password = document.getElementById(inputId).value;
        const strengthElement = document.getElementById(strengthId);
        const strength = checkPasswordStrength(password);
        strengthElement.textContent = `Password strength: ${strength}`;
        strengthElement.className = `mt-2 text-sm font-medium ${strength === 'Low' ? 'text-red-500' : strength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`;
    }

    document.getElementById('regPassword').addEventListener('input', () => updatePasswordStrength('regPassword', 'passwordStrength'));
    document.getElementById('fpNewPassword').addEventListener('input', () => updatePasswordStrength('fpNewPassword', 'fpPasswordStrength'));

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.success) {
                showPage('dashboardPage');
                userInfoUsername.textContent = data.username;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Registration successful. Please log in.');
                showPage('loginPage');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    let fpStep = 1;

    fpUsernameOrEmail.addEventListener('blur', async () => {
        if (fpUsernameOrEmail.value) {
            try {
                const response = await fetch('/check-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username_or_email: fpUsernameOrEmail.value }),
                });
                const data = await response.json();
                if (data.exists) {
                    newPasswordFields.classList.remove('hidden');
                    fpStep = 2;
                } else {
                    alert('User not found');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        }
    });

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (fpStep === 1) {
            alert('Please enter a valid username or email first.');
            return;
        }
    
        const newPassword = fpNewPassword.value;
        const confirmPassword = fpConfirmPassword.value;
    
        if (newPassword !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
    
        try {
            const response = await fetch('/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username_or_email: fpUsernameOrEmail.value, 
                    new_password: newPassword 
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Password reset successful. Please log in with your new password.');
                showPage('loginPage');
                forgotPasswordForm.reset();
                newPasswordFields.classList.add('hidden');
                fpStep = 1;
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    logoutButton.addEventListener('click', () => {
        showPage('loginPage');
        loginForm.reset();
        registerForm.reset();
        forgotPasswordForm.reset();
    });
});