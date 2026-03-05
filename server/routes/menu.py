from flask import Blueprint, request, jsonify
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from supabase_client import supabase
from middleware.auth import require_auth

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('', methods=['GET'])
def get_menu_items():
    """Get all menu items, optionally filtered by category."""
    category = request.args.get('category')
    try:
        query = supabase.table('menu_items').select('*').order('created_at', desc=True)
        if category and category != 'All':
            query = query.eq('category', category)
        result = query.execute()
        return jsonify(result.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@menu_bp.route('', methods=['POST'])
@require_auth
def add_menu_item():
    """Add a new menu item (admin only)."""
    data = request.get_json()
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({"error": "Name and price are required"}), 400
    try:
        result = supabase.table('menu_items').insert({
            "name": data['name'],
            "description": data.get('description', ''),
            "price": float(data['price']),
            "category": data.get('category', 'Main Course'),
            "image_url": data.get('image_url', ''),
            "is_available": data.get('is_available', True)
        }).execute()
        return jsonify(result.data[0] if result.data else {}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@menu_bp.route('/<item_id>', methods=['PUT'])
@require_auth
def update_menu_item(item_id):
    """Update menu item (admin only)."""
    data = request.get_json()
    try:
        result = supabase.table('menu_items').update(data).eq('id', item_id).execute()
        return jsonify(result.data[0] if result.data else {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@menu_bp.route('/<item_id>', methods=['DELETE'])
@require_auth
def delete_menu_item(item_id):
    """Delete menu item (admin only)."""
    try:
        supabase.table('menu_items').delete().eq('id', item_id).execute()
        return jsonify({"message": "Deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
