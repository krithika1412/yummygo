import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './Menu.css';

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Specials'];

const sampleMenu = [
    { id: 1, name: 'Truffle Mushroom Risotto', description: 'Creamy arborio rice with wild mushrooms and truffle oil', price: 650, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80', is_available: true },
    { id: 2, name: 'Seared Salmon', description: 'Atlantic salmon with lemon butter sauce and seasonal vegetables', price: 890, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80', is_available: true },
    { id: 3, name: 'Bruschetta Al Pomodoro', description: 'Toasted bread with fresh tomatoes, basil, and olive oil', price: 320, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80', is_available: true },
    { id: 4, name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert with mascarpone cream', price: 420, category: 'Desserts', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', is_available: true },
    { id: 5, name: 'Paneer Tikka', description: 'Spiced cottage cheese grilled in clay oven', price: 380, category: 'Starters', image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', is_available: true },
    { id: 6, name: 'Butter Chicken', description: 'Tender chicken in rich tomato and butter gravy', price: 450, category: 'Main Course', image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80', is_available: true },
    { id: 7, name: 'Mango Lassi', description: 'Sweet and refreshing yogurt drink with fresh mango', price: 180, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80', is_available: true },
    { id: 8, name: 'Chef\'s Special Thali', description: 'Complete meal platter with dal, sabzi, rice, roti, and dessert', price: 550, category: 'Specials', image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', is_available: true },
];

export default function Menu() {
    const [items, setItems] = useState(sampleMenu);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        api.getMenu().then(data => {
            if (data && data.length > 0) setItems(data);
        }).catch(() => { });
    }, []);

    const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

    return (
        <div className="page">
            <section className="menu-page section" id="menu-page">
                <div className="container">
                    <div className="section-title">
                        <div className="gold-line"></div>
                        <h2>Our Menu</h2>
                        <p>Handcrafted dishes made with the finest ingredients</p>
                    </div>

                    <div className="menu-categories">
                        {categories.map(c => (
                            <button
                                key={c}
                                className={`filter-chip ${activeCategory === c ? 'active' : ''}`}
                                onClick={() => setActiveCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="menu-grid grid grid-3">
                        {filtered.map(item => (
                            <div key={item.id} className="menu-card card" id={`menu-item-${item.id}`}>
                                <div className="menu-card-image">
                                    <img src={item.image_url} alt={item.name} loading="lazy" />
                                    {!item.is_available && <div className="unavailable-badge">Unavailable</div>}
                                </div>
                                <div className="menu-card-body">
                                    <div className="menu-card-header">
                                        <h4>{item.name}</h4>
                                        <span className="menu-price">₹{item.price}</span>
                                    </div>
                                    <p className="menu-desc">{item.description}</p>
                                    <span className="badge badge-gold">{item.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="empty-state">
                            <p>No items found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
