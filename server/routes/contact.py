from flask import Blueprint, request, jsonify
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from supabase_client import supabase
from middleware.auth import require_auth

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('', methods=['POST'])
def submit_contact():
    """Submit a contact enquiry."""
    data = request.get_json()
    required = ['name', 'email', 'subject', 'message']
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
    try:
        result = supabase.table('contacts').insert({
            "name": data['name'],
            "email": data['email'],
            "phone": data.get('phone', ''),
            "subject": data['subject'],
            "message": data['message']
        }).execute()
        return jsonify(result.data[0] if result.data else {}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@contact_bp.route('', methods=['GET'])
@require_auth
def get_contacts():
    """Get all contact enquiries (admin only)."""
    try:
        result = supabase.table('contacts').select('*').order('created_at', desc=True).execute()
        return jsonify(result.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
