import sys, os
from functools import wraps
from flask import request, jsonify

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from supabase_client import supabase

def require_auth(f):
    """Decorator to verify Supabase token using Supabase client."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(' ')[1]
        try:
            user_response = supabase.auth.get_user(token)
            request.user = user_response.user
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        return f(*args, **kwargs)
    return decorated
