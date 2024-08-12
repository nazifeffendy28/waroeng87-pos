# Waroeng 87 POS

A simple Point of Sale (POS) system for Waroeng 87 using Flask, HTML, JavaScript, and Tailwind CSS.

## Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/waroeng87_pos.git
   cd waroeng87_pos
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install flask flask-cors
   ```

4. Run the Flask application:
   ```
   python app.py
   ```

5. Open a web browser and navigate to `http://localhost:5000` to use the application.

## Features

- User registration and login
- Dark mode toggle
- Simple dashboard displaying user information
- Logout functionality

## Folder Structure

```
waroeng87_pos/
│
├── static/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
│
├── templates/
│   └── index.html
│
├── app.py
└── README.md
```

## Contributing

Feel free to fork this repository and submit pull requests for any improvements or bug fixes.

## License

This project is open source and available under the [MIT License](LICENSE).