from flask import Blueprint, request, jsonify
import sys, os
import json
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from supabase_client import supabase

import google.generativeai as genai

chat_bp = Blueprint('chat', __name__)

# Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

SYSTEM_PROMPT = """You are Foodify's AI Food Expert — a friendly, knowledgeable food assistant for the Foodify restaurant platform in India.

Your capabilities:
- Recommend the best food and restaurants in specific Indian cities
- Compare cuisines and dishes
- Suggest meals based on dietary preferences (vegetarian, non-veg, vegan)
- Help users decide what to order
- Share interesting food facts about Indian cuisine
- Guide users on what's popular in different locations

IMPORTANT RULES:
1. Always be enthusiastic and warm about food
2. When recommending restaurants, use the ACTUAL restaurant data provided to you — mention real names, locations, cuisines, and ratings
3. When discussing menu items, reference the ACTUAL menu items with their real prices
4. Keep responses concise but helpful (2-4 paragraphs max)
5. Use emojis sparingly to make responses feel friendly 🍛
6. If asked about something outside food/restaurants, politely redirect to food topics
7. Format recommendations in a clean, readable way
8. Always mention the city and cuisine type when recommending restaurants

Here is the current restaurant and menu data from the Foodify platform:

RESTAURANTS:
{restaurants}

MENU ITEMS:
{menu_items}
"""


def get_database_context():
    """Fetch restaurants and menu items from Supabase for AI context."""
    try:
        restaurants_result = supabase.table('restaurants').select(
            'name, cuisine, rating, city, state, address, is_featured, discount_text'
        ).order('rating', desc=True).limit(50).execute()

        menu_result = supabase.table('menu_items').select(
            'name, description, price, category, is_available'
        ).eq('is_available', True).execute()

        restaurants_text = ""
        for r in (restaurants_result.data or []):
            featured = " ⭐ FEATURED" if r.get('is_featured') else ""
            discount = f" | Offer: {r['discount_text']}" if r.get('discount_text') else ""
            restaurants_text += f"- {r['name']} | {r['cuisine']} | Rating: {r['rating']} | {r['city']}, {r['state']}{featured}{discount}\n"

        menu_text = ""
        for m in (menu_result.data or []):
            menu_text += f"- {m['name']} (₹{m['price']}) | {m['category']} — {m['description']}\n"

        return restaurants_text or "No restaurants available.", menu_text or "No menu items available."
    except Exception as e:
        return f"Error fetching data: {str(e)}", "Error fetching data."


@chat_bp.route('', methods=['POST'])
def chat():
    """Handle AI chat messages."""
    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API key not configured. Please set GEMINI_API_KEY in server .env"}), 500

    data = request.get_json()
    if not data or not data.get('message'):
        return jsonify({"error": "Message is required"}), 400

    user_message = data['message']
    history = data.get('history', [])

    try:
        # Get database context
        restaurants_context, menu_context = get_database_context()

        # Build the system prompt with real data
        full_system_prompt = SYSTEM_PROMPT.format(
            restaurants=restaurants_context,
            menu_items=menu_context
        )

        # Configure Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            'gemini-2.0-flash',
            system_instruction=full_system_prompt
        )

        # Build conversation history for context
        gemini_history = []
        for msg in history[-10:]:  # Keep last 10 messages for context
            role = 'user' if msg.get('role') == 'user' else 'model'
            gemini_history.append({
                'role': role,
                'parts': [msg.get('content', '')]
            })

        # Start chat with history
        chat_session = model.start_chat(history=gemini_history)

        # Send the new message
        response = chat_session.send_message(user_message)

        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"error": f"AI service error: {str(e)}"}), 500


@chat_bp.route('', methods=['OPTIONS'])
def chat_options():
    """Handle CORS preflight."""
    return jsonify({"status": "ok"}), 200
