import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import './AIChatbox.css';

const SUGGESTIONS = [
    "Best food in Mumbai?",
    "Recommend a restaurant",
    "Popular vegetarian dishes",
    "What's trending today?",
];

// ─── Smart Local Response Engine ───
let restaurantsCache = null;
let menuCache = null;

async function loadData() {
    if (restaurantsCache && menuCache) return;
    try {
        const [r, m] = await Promise.all([api.getRestaurants(), api.getMenu()]);
        restaurantsCache = r || [];
        menuCache = m || [];
    } catch {
        restaurantsCache = [];
        menuCache = [];
    }
}

function matchKeywords(text, keywords) {
    const lower = text.toLowerCase();
    return keywords.some((k) => lower.includes(k.toLowerCase()));
}

function getTopRestaurants(arr, n = 3) {
    return [...arr].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, n);
}

function formatRestaurant(r) {
    const stars = '⭐'.repeat(Math.round(r.rating || 4));
    const offer = r.discount_text ? ` | 🏷️ ${r.discount_text}` : '';
    return `🍽️ **${r.name}** — ${r.cuisine} cuisine\n📍 ${r.city} | ${stars} ${r.rating}${offer}`;
}

function formatMenuItem(m) {
    return `• **${m.name}** — ₹${m.price}\n  _${m.description}_`;
}

function generateLocalResponse(question) {
    const q = question.toLowerCase();
    const restaurants = restaurantsCache || [];
    const menu = menuCache || [];

    // ── City-specific queries ──
    const cities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata', 'pune', 'jaipur', 'goa', 'lucknow', 'amritsar', 'kochi', 'chandigarh', 'varanasi', 'indore', 'mysore', 'coimbatore', 'vizag', 'bhopal', 'ahmedabad'];
    const matchedCity = cities.find((c) => q.includes(c));

    if (matchedCity) {
        const cityRestaurants = restaurants.filter((r) => r.city?.toLowerCase().includes(matchedCity));
        if (cityRestaurants.length > 0) {
            const top = getTopRestaurants(cityRestaurants, 3);
            const list = top.map(formatRestaurant).join('\n\n');
            return `🌟 Here are the best restaurants in **${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)}**:\n\n${list}\n\nWould you like to know more about any of these, or see the full menu?`;
        }
        return `I don't have specific restaurant data for ${matchedCity} yet, but I'd love to help! Try asking about Mumbai, Delhi, Bangalore, Hyderabad, or other major Indian cities! 🍛`;
    }

    // ── Cuisine-specific queries ──
    const cuisines = ['mughlai', 'south indian', 'north indian', 'chinese', 'italian', 'continental', 'seafood', 'rajasthani', 'bengali', 'punjabi', 'goan', 'kerala', 'hyderabadi', 'awadhi', 'street food', 'fine dining', 'thai', 'asian', 'gujarati'];
    const matchedCuisine = cuisines.find((c) => q.includes(c));

    if (matchedCuisine) {
        const cuisineRestaurants = restaurants.filter((r) => r.cuisine?.toLowerCase().includes(matchedCuisine));
        if (cuisineRestaurants.length > 0) {
            const top = getTopRestaurants(cuisineRestaurants, 3);
            const list = top.map(formatRestaurant).join('\n\n');
            return `🍛 Top **${matchedCuisine.charAt(0).toUpperCase() + matchedCuisine.slice(1)}** restaurants on Foodify:\n\n${list}\n\nWant me to suggest dishes from our menu too?`;
        }
    }

    // ── Biryani ──
    if (matchKeywords(q, ['biryani', 'dum', 'pulao'])) {
        const biryaniRestaurants = restaurants.filter((r) =>
            r.name?.toLowerCase().includes('biryani') || r.cuisine?.toLowerCase().includes('hyderabadi') || r.name?.toLowerCase().includes('paradise') || r.name?.toLowerCase().includes('arsalan')
        );
        const biryaniMenu = menu.filter((m) => m.name?.toLowerCase().includes('biryani'));
        const top = getTopRestaurants(biryaniRestaurants.length ? biryaniRestaurants : restaurants.filter(r => r.cuisine?.toLowerCase().includes('mughlai')), 3);
        const list = top.map(formatRestaurant).join('\n\n');
        const menuItem = biryaniMenu.length ? `\n\n🍚 From our menu: ${formatMenuItem(biryaniMenu[0])}` : '';
        return `🍚 The best biryani spots on Foodify:\n\n${list}${menuItem}\n\nHyderabadi Dum Biryani is a must-try! Would you like to book a table?`;
    }

    // ── Vegetarian ──
    if (matchKeywords(q, ['vegetarian', 'veg ', 'vegan', 'paneer', 'dal'])) {
        const vegMenu = menu.filter((m) => matchKeywords(m.name || '', ['paneer', 'dal', 'hara', 'mushroom', 'palak', 'sabzi', 'idli', 'dosa', 'thali']) || matchKeywords(m.description || '', ['vegetarian', 'veg', 'cottage cheese', 'lentil', 'spinach']));
        const items = vegMenu.slice(0, 4).map(formatMenuItem).join('\n\n');
        return `🌿 Great vegetarian choices from our menu:\n\n${items || '• Palak Paneer, Dal Makhani, Hara Bhara Kebab, and more!'}\n\nWe have amazing vegetarian restaurants across India. Which city are you in?`;
    }

    // ── Non-veg / Chicken / Kebab ──
    if (matchKeywords(q, ['chicken', 'mutton', 'kebab', 'non-veg', 'nonveg', 'meat', 'lamb', 'fish', 'seafood', 'prawn'])) {
        const nonVegMenu = menu.filter((m) => matchKeywords(m.name || '', ['chicken', 'mutton', 'kebab', 'fish', 'lamb', 'prawn', 'seafood', 'salmon']));
        const items = nonVegMenu.slice(0, 4).map(formatMenuItem).join('\n\n');
        return `🍗 Top non-veg picks from our menu:\n\n${items || '• Butter Chicken, Seekh Kebab, Rogan Josh, and more!'}\n\nFor the best non-veg experience, try our featured restaurants! Which city would you like recommendations for?`;
    }

    // ── Dessert ──
    if (matchKeywords(q, ['dessert', 'sweet', 'gulab', 'rasmalai', 'tiramisu', 'cake', 'ice cream'])) {
        const dessertMenu = menu.filter((m) => m.category === 'Desserts');
        const items = dessertMenu.slice(0, 4).map(formatMenuItem).join('\n\n');
        return `🍮 Delicious desserts you'll love:\n\n${items || '• Gulab Jamun, Rasmalai, Tiramisu, Phirni, and more!'}\n\nEvery meal deserves a sweet ending! 😋`;
    }

    // ── Drinks / Beverages ──
    if (matchKeywords(q, ['drink', 'beverage', 'chai', 'tea', 'coffee', 'lassi', 'juice'])) {
        const drinkMenu = menu.filter((m) => m.category === 'Beverages');
        const items = drinkMenu.slice(0, 4).map(formatMenuItem).join('\n\n');
        return `☕ Refreshing beverages we offer:\n\n${items || '• Masala Chai, Mango Lassi, Filter Coffee, and more!'}\n\nPerfect companions for your meal!`;
    }

    // ── Recommend / Best / Popular / Trending ──
    if (matchKeywords(q, ['recommend', 'best', 'popular', 'trending', 'top', 'famous', 'good'])) {
        const featured = restaurants.filter((r) => r.is_featured);
        const top = getTopRestaurants(featured.length ? featured : restaurants, 4);
        const list = top.map(formatRestaurant).join('\n\n');
        return `🌟 Our top-rated restaurants right now:\n\n${list}\n\nThese are highly rated by our customers! Want me to narrow it down by city or cuisine?`;
    }

    // ── Offers / Discounts ──
    if (matchKeywords(q, ['offer', 'discount', 'deal', 'cheap', 'budget', 'affordable'])) {
        const withOffers = restaurants.filter((r) => r.discount_text);
        const top = withOffers.slice(0, 4);
        if (top.length) {
            const list = top.map(formatRestaurant).join('\n\n');
            return `🏷️ Amazing offers right now:\n\n${list}\n\nGrab these deals before they're gone!`;
        }
        return "We have many restaurants with great value. Which city are you looking at? I'll find the best deals for you! 💰";
    }

    // ── Menu / What to order ──
    if (matchKeywords(q, ['menu', 'order', 'eat', 'food', 'dish', 'meal', 'what should', 'what can'])) {
        const specials = menu.filter((m) => m.category === 'Specials');
        const starters = menu.filter((m) => m.category === 'Starters');
        const items = [...specials.slice(0, 2), ...starters.slice(0, 2)].map(formatMenuItem).join('\n\n');
        return `🍽️ Here's what I'd recommend from our menu:\n\n${items}\n\nWe have Starters, Main Course, Desserts, Beverages, and Chef's Specials! What category interests you?`;
    }

    // ── Price / Cost ──
    if (matchKeywords(q, ['price', 'cost', 'how much', 'expensive', 'rupee', '₹'])) {
        const sorted = [...menu].sort((a, b) => a.price - b.price);
        const affordable = sorted.slice(0, 3).map(formatMenuItem).join('\n\n');
        const premium = sorted.slice(-2).map(formatMenuItem).join('\n\n');
        return `💰 Our menu ranges from ₹${sorted[0]?.price} to ₹${sorted[sorted.length - 1]?.price}:\n\n**Budget-friendly picks:**\n${affordable}\n\n**Premium experiences:**\n${premium}\n\nWhat's your budget? I'll find the perfect options!`;
    }

    // ── Book / Reserve ──
    if (matchKeywords(q, ['book', 'reserv', 'table', 'seat'])) {
        return "🪑 You can easily book a table! Just head to our **Reservation** page, pick your restaurant, date, time, and number of guests. We'll confirm it instantly!\n\nWant me to suggest a restaurant first?";
    }

    // ── Hello / Greetings ──
    if (matchKeywords(q, ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
        return "Hello! 😊 Welcome to Foodify! I can help you with:\n\n• 🍛 Restaurant recommendations by city\n• 🥘 Menu suggestions and prices\n• 🌿 Vegetarian/non-veg options\n• 🏷️ Current offers and deals\n• 🪑 Table reservations\n\nWhat would you like to explore?";
    }

    // ── Thanks ──
    if (matchKeywords(q, ['thank', 'thanks', 'thx'])) {
        return "You're welcome! 😊 Happy to help. Enjoy your meal! If you need anything else, I'm always here. Bon appétit! 🍽️";
    }

    // ── Default fallback ──
    const randomTop = getTopRestaurants(restaurants, 3);
    if (randomTop.length) {
        const list = randomTop.map(formatRestaurant).join('\n\n');
        return `Great question! Here are some of our highest-rated restaurants to explore:\n\n${list}\n\nYou can ask me about:\n• Best food in any Indian city 🏙️\n• Cuisine types (Mughlai, South Indian, etc.) 🍛\n• Vegetarian or non-veg options 🌿\n• Current offers and deals 🏷️\n\nWhat interests you?`;
    }

    return "I'd love to help you discover amazing food! Try asking about:\n• Best restaurants in Mumbai, Delhi, or Bangalore\n• Vegetarian menu recommendations\n• Biryani spots\n• Current offers\n\nWhat sounds good? 🍛";
}

// ─── Gemini AI (optional enhancement) ───
let geminiChat = null;
let geminiAvailable = null; // null = not tested, true/false = tested

async function tryGemini(message, restaurants, menu) {
    if (geminiAvailable === false) return null;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) { geminiAvailable = false; return null; }

    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);

        if (!geminiChat) {
            let context = "\n\nRESTAURANTS:\n";
            (restaurants || []).slice(0, 30).forEach((r) => {
                context += `- ${r.name} | ${r.cuisine} | Rating: ${r.rating} | ${r.city}${r.discount_text ? ' | Offer: ' + r.discount_text : ''}\n`;
            });
            context += "\n\nMENU ITEMS:\n";
            (menu || []).forEach((m) => {
                context += `- ${m.name} (₹${m.price}) | ${m.category}\n`;
            });

            const systemPrompt = `You are Foodify's AI Food Expert. Recommend restaurants and food from the data below. Be friendly, concise (2-3 paragraphs), use emojis sparingly.${context}`;

            const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
            for (const modelName of models) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        ...(modelName !== 'gemini-pro' ? { systemInstruction: systemPrompt } : {}),
                    });
                    const chat = model.startChat({
                        history: modelName === 'gemini-pro'
                            ? [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: 'Ready to help with food recommendations!' }] }]
                            : [],
                    });
                    // Test it
                    const testResult = await chat.sendMessage(message);
                    const reply = testResult.response.text();
                    geminiChat = chat;
                    geminiAvailable = true;
                    console.log(`AI Chatbox: Gemini ${modelName} active`);
                    return reply;
                } catch (err) {
                    console.warn(`Gemini ${modelName} unavailable:`, err.message);
                    continue;
                }
            }
            geminiAvailable = false;
            return null;
        }

        const result = await geminiChat.sendMessage(message);
        return result.response.text();
    } catch (err) {
        console.warn('Gemini error, using local engine:', err.message);
        geminiChat = null;
        geminiAvailable = false;
        return null;
    }
}

// ─── Component ───
export default function AIChatbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            content: "Hello! 👋 I'm Foodify's AI Food Expert. Ask me anything about restaurants, cuisines, or food recommendations across India! 🍛",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Preload data when chatbox opens
    useEffect(() => {
        if (isOpen) loadData();
    }, [isOpen]);

    const sendMessage = async (text) => {
        const userMessage = text || input.trim();
        if (!userMessage || isLoading) return;

        setInput('');
        setShowSuggestions(false);
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            await loadData();

            // Try Gemini first, fall back to local engine
            const geminiReply = await tryGemini(userMessage, restaurantsCache, menuCache);
            const reply = geminiReply || generateLocalResponse(userMessage);

            setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            // Even if everything fails, local engine works offline
            const reply = generateLocalResponse(userMessage);
            setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <button
                className={`chatbox-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Chat"
                id="ai-chatbox-toggle"
            >
                {isOpen ? '✕' : '✦'}
            </button>

            {isOpen && (
                <div className="chatbox-panel" id="ai-chatbox-panel">
                    <div className="chatbox-header">
                        <div className="chatbox-header-icon">🍽️</div>
                        <div className="chatbox-header-info">
                            <h4>Foodify AI Expert</h4>
                            <p>Online — Ask me about food!</p>
                        </div>
                    </div>

                    <div className="chatbox-messages" id="ai-chatbox-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}>
                                <div className="chat-message-avatar">
                                    {msg.role === 'user' ? '👤' : '🍛'}
                                </div>
                                <div className="chat-message-bubble">
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="typing-indicator">
                                <div className="chat-message-avatar">🍛</div>
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {showSuggestions && messages.length <= 1 && (
                        <div className="chatbox-suggestions">
                            {SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="chatbox-suggestion-chip"
                                    onClick={() => sendMessage(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="chatbox-input-area">
                        <input
                            ref={inputRef}
                            type="text"
                            className="chatbox-input"
                            placeholder="Ask about food, restaurants..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            id="ai-chatbox-input"
                        />
                        <button
                            className="chatbox-send"
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            aria-label="Send message"
                            id="ai-chatbox-send"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
