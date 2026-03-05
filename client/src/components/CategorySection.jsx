import { useNavigate } from 'react-router-dom';
import './CategorySection.css';

const categories = [
    { name: 'South Indian', icon: '🥞', color: '#F39C12', query: 'South Indian' },
    { name: 'North Indian', icon: '🍱', color: '#2ECC71', query: 'North Indian' },
    { name: 'Fine Dining', icon: '🍽️', color: '#9B59B6', query: 'Fine Dining' },
    { name: 'Street Food', icon: '🍔', color: '#E74C3C', query: 'Street Food' },
    { name: 'Seafood', icon: '🦐', color: '#3498DB', query: 'Seafood' },
    { name: 'Mughlai', icon: '🍗', color: '#E91E63', query: 'Mughlai' },
    { name: 'Continental', icon: '🍝', color: '#1ABC9C', query: 'Continental' },
    { name: 'Chinese', icon: '🥡', color: '#FF5722', query: 'Chinese' },
];

export default function CategorySection() {
    const navigate = useNavigate();

    const handleCategoryClick = (query) => {
        navigate(`/restaurants?cuisine=${encodeURIComponent(query)}`);
    };

    return (
        <section className="categories section" id="categories-section">
            <div className="container">
                <div className="section-title">
                    <div className="gold-line"></div>
                    <h2>Explore Categories</h2>
                    <p>Find exactly what you're craving</p>
                </div>
                <div className="category-grid">
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            className="category-chip"
                            onClick={() => handleCategoryClick(cat.query)}
                            style={{ '--chip-color': cat.color }}
                            id={`cat-${cat.name.toLowerCase().replace(/\s/g, '-')}`}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-name">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
