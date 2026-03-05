import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import BookingOptions from '../components/BookingOptions';
import CategorySection from '../components/CategorySection';
import RestaurantCard from '../components/RestaurantCard';
import { api } from '../services/api';
import './Home.css';

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        api.getRestaurants().then(data => {
            if (data && data.length > 0) {
                // Show featured restaurants first, limit to 8
                const featured = data.filter(r => r.is_featured);
                const rest = data.filter(r => !r.is_featured);
                setRestaurants([...featured, ...rest].slice(0, 8));
            }
        }).catch(() => { });
    }, []);

    return (
        <div className="page">
            <HeroBanner />
            <BookingOptions />
            <CategorySection />

            <section className="restaurants-section section" id="restaurants-near-you">
                <div className="container">
                    <div className="section-title">
                        <div className="gold-line"></div>
                        <h2>Top Restaurants Across India</h2>
                        <p>Discover top-rated dining spots from every corner of India</p>
                    </div>

                    <div className="restaurant-grid grid grid-4">
                        {restaurants.map(r => (
                            <RestaurantCard key={r.id} restaurant={r} />
                        ))}
                    </div>

                    <div className="text-center mt-3">
                        <a href="/restaurants" className="btn btn-outline">View All Restaurants</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
