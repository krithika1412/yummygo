import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/menu', label: 'Menu' },
        { to: '/restaurants', label: 'Restaurants' },
        { to: '/reservation', label: 'Reserve' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🍽</span>
                    <span className="logo-text">Foodify</span>
                </Link>

                <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="navbar-actions">
                    {user ? (
                        <div className="user-menu">
                            {user.email?.includes('admin') && (
                                <Link to="/admin" className="btn btn-outline btn-sm">Admin</Link>
                            )}
                            <button onClick={signOut} className="btn btn-gold btn-sm">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-gold btn-sm">Login</Link>
                    )}
                </div>

                <button
                    className={`hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    id="hamburger-btn"
                >
                    <span></span><span></span><span></span>
                </button>
            </div>
        </nav>
    );
}
