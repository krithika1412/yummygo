from flask import Blueprint, request, jsonify
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from supabase_client import supabase
from middleware.auth import require_auth

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('', methods=['GET'])
def get_restaurants():
    """Get all restaurants with optional search and filters."""
    search = request.args.get('search', '')
    cuisine = request.args.get('cuisine', '')
    city = request.args.get('city', '')
    sort = request.args.get('sort', 'Relevance')

    try:
        query = supabase.table('restaurants').select('*')

        if search:
            query = query.or_(f"name.ilike.%{search}%,cuisine.ilike.%{search}%,city.ilike.%{search}%")

        if cuisine and cuisine != 'All':
            query = query.eq('cuisine', cuisine)

        if city and city != 'All':
            query = query.eq('city', city)

        if sort == 'Rating':
            query = query.order('rating', desc=True)
        else:
            query = query.order('is_featured', desc=True)

        result = query.execute()
        return jsonify(result.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@restaurants_bp.route('/<restaurant_id>', methods=['PUT'])
@require_auth
def update_restaurant(restaurant_id):
    """Update restaurant details (admin only) — primarily for table availability."""
    data = request.get_json()
    try:
        update_data = {}
        if 'available_tables' in data:
            update_data['available_tables'] = int(data['available_tables'])
        if 'total_tables' in data:
            update_data['total_tables'] = int(data['total_tables'])

        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400

        result = supabase.table('restaurants').update(update_data).eq('id', restaurant_id).execute()
        return jsonify(result.data[0] if result.data else {})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
