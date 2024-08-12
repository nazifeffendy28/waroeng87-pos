document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showForgotPasswordLink = document.getElementById('showForgotPassword');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username');
            const password = document.getElementById('password');

            if (!username || !password) {
                console.error('Username or password input not found');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: username.value, password: password.value }),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (data.success) {
                    document.querySelector('.auth-container')?.classList.add('zoom-in');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 500);
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthPage('#loginPage', '#registerPage');
        });
    }

    if (showForgotPasswordLink) {
        showForgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchAuthPage('#loginPage', '#forgotPasswordPage');
        });
    }
});