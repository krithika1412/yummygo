import { Link } from 'react-router-dom';
import './RestaurantCard.css';

export default function RestaurantCard({ restaurant }) {
    const { name, cuisine, rating, image_url, address, city, discount_text, available_tables, total_tables } = restaurant;

    return (
        <div className="restaurant-card card" id={`restaurant-${restaurant.id}`}>
            <div className="card-image-wrapper">
                <img
                    src={image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80'}
                    alt={name}
                    className="card-image"
                    loading="lazy"
                />
                {discount_text && (
                    <div className="discount-ribbon">{discount_text}</div>
                )}
                <div className="card-rating">
                    <span>⭐</span> {rating || '4.0'}
                </div>
            </div>
            <div className="card-body">
                <h4 className="card-title">{name}</h4>
                <p className="card-cuisine">{cuisine || 'Multi-Cuisine'}</p>
                {(address || city) && <p className="card-address">📍 {city ? `${address}, ${city}` : address}</p>}
                <div className="card-footer">
                    {available_tables != null && (
                        <span className={`badge ${available_tables > 0 ? 'badge-success' : 'badge-danger'}`}>
                            {available_tables > 0 ? `${available_tables} tables free` : 'Fully booked'}
                        </span>
                    )}
                    <Link to={`/reservation?restaurant=${restaurant.id}`} className="btn btn-gold btn-xs card-book-btn">
                        Book Table
                    </Link>
                </div>
            </div>
        </div>
    );
}
