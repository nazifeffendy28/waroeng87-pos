from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_bcrypt import Bcrypt
from functools import wraps
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)
bcrypt = Bcrypt(app)

# This is a simple in-memory user store. In a real application, you'd use a database.
users = {}

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
        user = users.get(username)
        if user and bcrypt.check_password_hash(user['password'], password):
            session['user_id'] = username
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
        if username in users:
            return jsonify({"success": False, "message": "Username already exists."})
        else:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            users[username] = {'password': hashed_password, 'email': email}
            return jsonify({"success": True, "message": "Registered successfully. Please log in."})
    return render_template('register.html')

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        user = next((u for u in users if users[u]['email'] == email), None)
        if user:
            return jsonify({"success": True, "message": "User found. Please enter a new password."})
        else:
            return jsonify({"success": False, "message": "Email not found."})
    return render_template('forgot_password.html')

@app.route('/reset-password', methods=['POST'])
def reset_password():
    email = request.form['email']
    new_password = request.form['new_password']
    user = next((u for u in users if users[u]['email'] == email), None)
    if user:
        users[user]['password'] = bcrypt.generate_password_hash(new_password).decode('utf-8')
        return jsonify({"success": True, "message": "Password reset successfully. Please log in."})
    else:
        return jsonify({"success": False, "message": "Email not found."})

@app.route('/dashboard')
@login_required
def dashboard():
    user = users[session['user_id']]
    return render_template('dashboard.html', username=session['user_id'], email=user['email'])

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