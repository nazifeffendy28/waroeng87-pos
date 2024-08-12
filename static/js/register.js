document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const showLoginLink = document.getElementById('showLogin');
    const regPassword = document.getElementById('regPassword');
    const passwordStrength = document.getElementById('passwordStrength');

    function updatePasswordStrength(password) {
        const strength = checkPasswordStrength(password);
        if (passwordStrength) {
            passwordStrength.textContent = `Password strength: ${strength}`;
            passwordStrength.className = `mt-2 text-sm font-medium ${strength === 'Low' ? 'text-red-500' : strength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`;
        }
    }

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

    if (regPassword) {
        regPassword.addEventListener('input', (e) => updatePasswordStrength(e.target.value));
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername');
            const email = document.getElementById('regEmail');
            const confirmPassword = document.getElementById('regConfirmPassword');

            if (!username || !email || !regPassword || !confirmPassword) {
                console.error('One or more form inputs not found');
                return;
            }

            if (regPassword.value !== confirmPassword.value) {
                alert("Passwords don't match");
                return;
            }

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: username.value, 
                        email: email.value, 
                        password: regPassword.value 
                    }),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (data.success) {
                    alert('Registration successful. Please log in.');
                    if (typeof switchAuthPage === 'function') {
                        switchAuthPage('#registerPage', '#loginPage');
                    } else {
                        window.location.href = '/login';
                    }
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof switchAuthPage === 'function') {
                switchAuthPage('#registerPage', '#loginPage');
            } else {
                window.location.href = '/login';
            }
        });
    }
});