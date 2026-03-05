import { Link } from 'react-router-dom';
import './BookingOptions.css';

export default function BookingOptions() {
    return (
        <section className="booking-options section" id="booking-options">
            <div className="container">
                <div className="section-title">
                    <div className="gold-line"></div>
                    <h2>Dining Options</h2>
                    <p>Choose how you'd like to enjoy your meal</p>
                </div>
                <div className="booking-grid">
                    <Link to="/reservation" className="booking-card" id="book-table-card">
                        <div className="booking-icon">📅</div>
                        <h3>Book a Table</h3>
                        <p>Reserve your perfect dining spot. Choose date, time, and party size.</p>
                        <span className="booking-cta">Reserve Now →</span>
                    </Link>
                    <Link to="/restaurants" className="booking-card" id="walkin-card">
                        <div className="booking-icon">🚶</div>
                        <h3>Walk-in Dining</h3>
                        <p>No reservation needed. Walk in and enjoy our ambiance instantly.</p>
                        <span className="booking-cta">Find Restaurants →</span>
                    </Link>
                    <Link to="/menu" className="booking-card" id="delivery-card">
                        <div className="booking-icon">🛵</div>
                        <h3>Order Food</h3>
                        <p>Browse our menu and order your favorite dishes for delivery.</p>
                        <span className="booking-cta">Order Now →</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
