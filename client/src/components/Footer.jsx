import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer" id="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3><span className="text-gold">🍽 Foodify</span></h3>
                        <p>Discover the finest restaurants and book your perfect dining experience. Premium food, premium service.</p>
                        <div className="footer-socials">
                            <a href="#" aria-label="Facebook">📘</a>
                            <a href="#" aria-label="Instagram">📸</a>
                            <a href="#" aria-label="Twitter">🐦</a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/restaurants">Restaurants</Link></li>
                            <li><Link to="/reservation">Reserve Table</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Categories</h4>
                        <ul>
                            <li><a href="#">Breakfast</a></li>
                            <li><a href="#">Lunch</a></li>
                            <li><a href="#">Dinner</a></li>
                            <li><a href="#">Fast Food</a></li>
                            <li><a href="#">Desserts</a></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact Info</h4>
                        <ul>
                            <li>📍 123 Food Street, Mumbai</li>
                            <li>📞 +91 98765 43210</li>
                            <li>✉️ hello@foodify.com</li>
                            <li>🕐 Mon-Sun: 10AM - 11PM</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Foodify. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
