document.addEventListener('DOMContentLoaded', () => {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const fpUsernameOrEmail = document.getElementById('fpUsernameOrEmail');
    const newPasswordFields = document.getElementById('newPasswordFields');
    const fpNewPassword = document.getElementById('fpNewPassword');
    const fpConfirmPassword = document.getElementById('fpConfirmPassword');
    const showLoginFromForgotPassword = document.getElementById('showLoginFromForgotPassword');

    let fpStep = 1;

    function updatePasswordStrength(password) {
        const strengthElement = document.getElementById('fpPasswordStrength');
        if (strengthElement) {
            const strength = checkPasswordStrength(password);
            strengthElement.textContent = `Password strength: ${strength}`;
            strengthElement.className = `mt-2 text-sm font-medium ${strength === 'Low' ? 'text-red-500' : strength === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`;
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

    if (fpNewPassword) {
        fpNewPassword.addEventListener('input', (e) => updatePasswordStrength(e.target.value));
    }

    if (fpUsernameOrEmail) {
        fpUsernameOrEmail.addEventListener('blur', async () => {
            if (fpUsernameOrEmail.value) {
                try {
                    const response = await fetch('/check-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username_or_email: fpUsernameOrEmail.value }),
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    if (data.exists) {
                        newPasswordFields?.classList.remove('hidden');
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
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (fpStep === 1) {
                alert('Please enter a valid username or email first.');
                return;
            }
        
            if (!fpNewPassword || !fpConfirmPassword) {
                console.error('New password or confirm password input not found');
                return;
            }
        
            if (fpNewPassword.value !== fpConfirmPassword.value) {
                alert("Passwords don't match");
                return;
            }
        
            try {
                const response = await fetch('/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username_or_email: fpUsernameOrEmail.value, 
                        new_password: fpNewPassword.value 
                    }),
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                if (data.success) {
                    alert('Password reset successful. Please log in with your new password.');
                    if (typeof switchAuthPage === 'function') {
                        switchAuthPage('#forgotPasswordPage', '#loginPage');
                    } else {
                        window.location.href = '/login';
                    }
                    forgotPasswordForm.reset();
                    newPasswordFields?.classList.add('hidden');
                    fpStep = 1;
                } else {
                    alert(data.message || 'Password reset failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    if (showLoginFromForgotPassword) {
        showLoginFromForgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof switchAuthPage === 'function') {
                switchAuthPage('#forgotPasswordPage', '#loginPage');
            } else {
                window.location.href = '/login';
            }
        });
    }
});