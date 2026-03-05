from flask import Blueprint, request, jsonify
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from supabase_client import supabase
from middleware.auth import require_auth

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('', methods=['GET'])
@require_auth
def get_reservations():
    """Get all reservations (admin only)."""
    try:
        result = supabase.table('reservations').select('*').order('created_at', desc=True).execute()
        return jsonify(result.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reservations_bp.route('', methods=['POST'])
def create_reservation():
    """Create a new reservation."""
    data = request.get_json()
    required = ['name', 'email', 'phone', 'date', 'time', 'guests']
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
    try:
        insert_data = {
            "name": data['name'],
            "email": data['email'],
            "phone": data['phone'],
            "date": data['date'],
            "time": data['time'],
            "guests": int(data['guests']),
            "status": "pending"
        }
        if data.get('restaurant_id'):
            insert_data["restaurant_id"] = data['restaurant_id']

        result = supabase.table('reservations').insert(insert_data).execute()
        return jsonify(result.data[0] if result.data else {}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reservations_bp.route('/<res_id>', methods=['PUT'])
@require_auth
def update_reservation(res_id):
    """Update reservation status (admin only)."""
    data = request.get_json()
    try:
        result = supabase.table('reservations').update(data).eq('id', res_id).execute()
        return jsonify(result.data[0] if result.data else {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reservations_bp.route('/<res_id>', methods=['DELETE'])
@require_auth
def delete_reservation(res_id):
    """Delete a reservation (admin only)."""
    try:
        supabase.table('reservations').delete().eq('id', res_id).execute()
        return jsonify({"message": "Deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
