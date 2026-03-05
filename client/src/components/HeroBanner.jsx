import './HeroBanner.css';

export default function HeroBanner() {
    return (
        <section className="hero" id="hero-banner">
            <div className="hero-overlay"></div>
            <div className="hero-content animate-fade-in-up">
                <div className="hero-badge">
                    <span>🔥 Limited Time Offer</span>
                </div>
                <h1>Get Up To <span className="text-gold">₹300 OFF</span></h1>
                <p className="hero-subtitle">
                    Discover the finest restaurants near you. Book a table or order your favorite meal with exclusive discounts.
                </p>
                <div className="hero-actions">
                    <a href="/reservation" className="btn btn-gold btn-lg">Book a Table</a>
                    <a href="/menu" className="btn btn-outline btn-lg">Explore Menu</a>
                </div>
                <div className="hero-stats">
                    <div className="stat">
                        <span className="stat-number">500+</span>
                        <span className="stat-label">Restaurants</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Happy Customers</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">50+</span>
                        <span className="stat-label">Cuisines</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
