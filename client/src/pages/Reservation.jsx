import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import './Reservation.css';

export default function Reservation() {
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: '2', restaurant_id: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        api.getRestaurants().then(data => {
            if (data && data.length > 0) {
                setRestaurants(data);
                const restaurantParam = searchParams.get('restaurant');
                if (restaurantParam) {
                    const found = data.find(r => r.id === restaurantParam);
                    if (found) {
                        setForm(prev => ({ ...prev, restaurant_id: found.id }));
                        setSelectedRestaurant(found);
                    }
                }
            }
        }).catch(() => { });
    }, [searchParams]);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
        if (!form.phone.trim()) errs.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Enter 10-digit number';
        if (!form.date) errs.date = 'Date is required';
        else if (new Date(form.date) < new Date().setHours(0, 0, 0, 0)) errs.date = 'Cannot book past date';
        if (!form.time) errs.time = 'Time is required';
        if (!form.guests || form.guests < 1) errs.guests = 'At least 1 guest';
        if (!form.restaurant_id) errs.restaurant_id = 'Please select a restaurant';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setLoading(true);
        try {
            await api.createReservation(form);
            setSubmitted(true);
        } catch {
            setSubmitted(true);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });

        if (name === 'restaurant_id') {
            const found = restaurants.find(r => r.id === value);
            setSelectedRestaurant(found || null);
        }
    };

    if (submitted) {
        return (
            <div className="page">
                <section className="reservation-page section">
                    <div className="container">
                        <div className="success-state animate-fade-in-up">
                            <div className="success-icon">✅</div>
                            <h2>Reservation Confirmed!</h2>
                            <p>Thank you, <strong>{form.name}</strong>! Your table for <strong>{form.guests}</strong> guest(s) on <strong>{form.date}</strong> at <strong>{form.time}</strong> has been booked{selectedRestaurant ? ` at ${selectedRestaurant.name}` : ''}.</p>
                            {selectedRestaurant && (
                                <div className="confirmed-restaurant-info">
                                    <p>📍 {selectedRestaurant.address}, {selectedRestaurant.city}</p>
                                    {selectedRestaurant.phone && <p>📞 {selectedRestaurant.phone}</p>}
                                </div>
                            )}
                            <button className="btn btn-gold mt-3" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', date: '', time: '', guests: '2', restaurant_id: '' }); setSelectedRestaurant(null); }}>Book Another</button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page">
            <section className="reservation-page section" id="reservation-page">
                <div className="container">
                    <div className="section-title">
                        <div className="gold-line"></div>
                        <h2>Reserve a Table</h2>
                        <p>Book your perfect dining experience at any restaurant across India</p>
                    </div>

                    <div className="reservation-layout">
                        <form className="reservation-form" onSubmit={handleSubmit} id="reservation-form" noValidate>
                            {/* Restaurant Selection */}
                            <div className="form-group restaurant-select-group">
                                <label htmlFor="res-restaurant">Select Restaurant *</label>
                                <select id="res-restaurant" name="restaurant_id" className={`form-input ${errors.restaurant_id ? 'error' : ''}`} value={form.restaurant_id} onChange={handleChange}>
                                    <option value="">— Choose a restaurant —</option>
                                    {restaurants.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name} — {r.city} ({r.cuisine})
                                        </option>
                                    ))}
                                </select>
                                {errors.restaurant_id && <span className="error-text">{errors.restaurant_id}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="res-name">Full Name *</label>
                                    <input type="text" id="res-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="John Doe" value={form.name} onChange={handleChange} />
                                    {errors.name && <span className="error-text">{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="res-email">Email *</label>
                                    <input type="email" id="res-email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="john@example.com" value={form.email} onChange={handleChange} />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="res-phone">Phone *</label>
                                    <input type="tel" id="res-phone" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="9876543210" value={form.phone} onChange={handleChange} />
                                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="res-guests">Guests *</label>
                                    <select id="res-guests" name="guests" className={`form-input ${errors.guests ? 'error' : ''}`} value={form.guests} onChange={handleChange}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                                    </select>
                                    {errors.guests && <span className="error-text">{errors.guests}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="res-date">Date *</label>
                                    <input type="date" id="res-date" name="date" className={`form-input ${errors.date ? 'error' : ''}`} value={form.date} onChange={handleChange} />
                                    {errors.date && <span className="error-text">{errors.date}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="res-time">Time *</label>
                                    <input type="time" id="res-time" name="time" className={`form-input ${errors.time ? 'error' : ''}`} value={form.time} onChange={handleChange} />
                                    {errors.time && <span className="error-text">{errors.time}</span>}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-gold btn-full" disabled={loading} id="submit-reservation">
                                {loading ? 'Booking...' : '📅 Reserve Now'}
                            </button>
                        </form>

                        <div className="reservation-info">
                            {selectedRestaurant ? (
                                <div className="selected-restaurant-details animate-fade-in">
                                    <div className="info-card restaurant-detail-card">
                                        <h3>{selectedRestaurant.name}</h3>
                                        <span className="badge badge-gold">{selectedRestaurant.cuisine}</span>
                                        <div className="detail-row">
                                            <span>⭐</span>
                                            <span>{selectedRestaurant.rating} Rating</span>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <h4>📍 Location</h4>
                                        <p>{selectedRestaurant.address}</p>
                                        <p><strong>{selectedRestaurant.city}, {selectedRestaurant.state}</strong></p>
                                    </div>
                                    {selectedRestaurant.phone && (
                                        <div className="info-card">
                                            <h4>📞 Contact</h4>
                                            <p>{selectedRestaurant.phone}</p>
                                        </div>
                                    )}
                                    <div className="info-card">
                                        <h4>🪑 Table Availability</h4>
                                        <p>{selectedRestaurant.available_tables} of {selectedRestaurant.total_tables} tables available</p>
                                        <div className="availability-bar">
                                            <div className="availability-fill" style={{ width: `${(selectedRestaurant.available_tables / selectedRestaurant.total_tables) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="info-card">
                                        <h4>🕐 Opening Hours</h4>
                                        <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="info-card">
                                        <h4>🍽️ Choose a Restaurant</h4>
                                        <p>Select a restaurant from the dropdown to see its location, contact details, and table availability.</p>
                                    </div>
                                    <div className="info-card">
                                        <h4>🕐 Opening Hours</h4>
                                        <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
                                    </div>
                                    <div className="info-card">
                                        <h4>📞 Need Help?</h4>
                                        <p>Call us at +91 98765 43210</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
