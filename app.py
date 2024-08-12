from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_bcrypt import Bcrypt
from functools import wraps
import json
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
bcrypt = Bcrypt(app)

# Load users from JSON file
def load_users():
    with open('data/users.json', 'r') as f:
        return json.load(f)['users']

# Save users to JSON file
def save_users(users):
    with open('data/users.json', 'w') as f:
        json.dump({'users': users}, f, indent=2)

# Hash passwords for existing users
users = load_users()
for user in users:
    if 'hashed_password' not in user:
        user['hashed_password'] = bcrypt.generate_password_hash(user['password']).decode('utf-8')
        del user['password']
save_users(users)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        users = load_users()
        user = next((user for user in users if user['username'] == username), None)
        if user and bcrypt.check_password_hash(user['hashed_password'], password):
            session['user_id'] = user['id']
            return jsonify({"success": True, "message": "Logged in successfully."})
        else:
            return jsonify({"success": False, "message": "Invalid username or password."})
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        users = load_users()
        if any(user['username'] == username for user in users):
            return jsonify({"success": False, "message": "Username already exists."})
        else:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = {
                'id': max(user['id'] for user in users) + 1,
                'username': username,
                'email': email,
                'hashed_password': hashed_password
            }
            users.append(new_user)
            save_users(users)
            return jsonify({"success": True, "message": "Registered successfully. Please log in."})
    return render_template('register.html')

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        users = load_users()
        user = next((u for u in users if u['email'] == email), None)
        if user:
            return jsonify({"success": True, "message": "User found. Please enter a new password."})
        else:
            return jsonify({"success": False, "message": "Email not found."})
    return render_template('forgot_password.html')

@app.route('/reset-password', methods=['POST'])
def reset_password():
    email = request.form['email']
    new_password = request.form['new_password']
    users = load_users()
    user = next((u for u in users if u['email'] == email), None)
    if user:
        user['hashed_password'] = bcrypt.generate_password_hash(new_password).decode('utf-8')
        save_users(users)
        return jsonify({"success": True, "message": "Password reset successfully. Please log in."})
    else:
        return jsonify({"success": False, "message": "Email not found."})

@app.route('/dashboard')
@login_required
def dashboard():
    users = load_users()
    user = next((u for u in users if u['id'] == session['user_id']), None)
    return render_template('dashboard.html', username=user['username'], email=user['email'])

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Logged out successfully."})

@app.route('/toggle-theme', methods=['POST'])
def toggle_theme():
    theme = request.json.get('theme')
    session['theme'] = theme
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)