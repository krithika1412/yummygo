import os
from flask import Flask, jsonify
from flask_cors import CORS

# Import route blueprints
from routes.menu import menu_bp
from routes.reservations import reservations_bp
from routes.contact import contact_bp
from routes.restaurants import restaurants_bp
from routes.chat import chat_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(menu_bp, url_prefix='/api/menu')
app.register_blueprint(reservations_bp, url_prefix='/api/reservations')
app.register_blueprint(contact_bp, url_prefix='/api/contact')
app.register_blueprint(restaurants_bp, url_prefix='/api/restaurants')
app.register_blueprint(chat_bp, url_prefix='/api/chat')

@app.route('/api/health')
def health():
    return jsonify({"status": "ok", "message": "Foodify API is running"})

@app.route('/')
def home():
    return jsonify({"message": "Welcome to Foodify API", "version": "1.0.0"})

# For local development
if __name__ == '__main__':
    app.run(debug=True, port=5000)
