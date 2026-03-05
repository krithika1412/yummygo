import { useState } from 'react';
import { api } from '../services/api';
import './Contact.css';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
        if (!form.subject.trim()) errs.subject = 'Subject is required';
        if (!form.message.trim()) errs.message = 'Message is required';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setLoading(true);
        try {
            await api.submitContact(form);
        } catch { }
        setSubmitted(true);
        setLoading(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    return (
        <div className="page">
            <section className="contact-page section" id="contact-page">
                <div className="container">
                    <div className="section-title">
                        <div className="gold-line"></div>
                        <h2>Contact Us</h2>
                        <p>We'd love to hear from you</p>
                    </div>

                    <div className="contact-layout">
                        <div className="contact-info-grid">
                            <div className="contact-info-card">
                                <span className="contact-icon">📍</span>
                                <h4>Visit Us</h4>
                                <p>123 Food Street, Gourmet Lane<br />Mumbai, Maharashtra 400001</p>
                            </div>
                            <div className="contact-info-card">
                                <span className="contact-icon">📞</span>
                                <h4>Call Us</h4>
                                <p>+91 98765 43210<br />+91 98765 43211</p>
                            </div>
                            <div className="contact-info-card">
                                <span className="contact-icon">✉️</span>
                                <h4>Email Us</h4>
                                <p>hello@foodify.com<br />support@foodify.com</p>
                            </div>
                            <div className="contact-info-card">
                                <span className="contact-icon">🕐</span>
                                <h4>Opening Hours</h4>
                                <p>Mon - Fri: 10AM - 11PM<br />Sat - Sun: 9AM - 12AM</p>
                            </div>
                        </div>

                        {submitted ? (
                            <div className="success-state animate-fade-in-up">
                                <div className="success-icon">✅</div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button className="btn btn-gold mt-2" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}>Send Another</button>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} id="contact-form" noValidate>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contact-name">Name *</label>
                                        <input type="text" id="contact-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your name" value={form.name} onChange={handleChange} />
                                        {errors.name && <span className="error-text">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contact-email">Email *</label>
                                        <input type="email" id="contact-email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" value={form.email} onChange={handleChange} />
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="contact-phone">Phone</label>
                                        <input type="tel" id="contact-phone" name="phone" className="form-input" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contact-subject">Subject *</label>
                                        <input type="text" id="contact-subject" name="subject" className={`form-input ${errors.subject ? 'error' : ''}`} placeholder="How can we help?" value={form.subject} onChange={handleChange} />
                                        {errors.subject && <span className="error-text">{errors.subject}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact-message">Message *</label>
                                    <textarea id="contact-message" name="message" rows="5" className={`form-input ${errors.message ? 'error' : ''}`} placeholder="Tell us more..." value={form.message} onChange={handleChange}></textarea>
                                    {errors.message && <span className="error-text">{errors.message}</span>}
                                </div>

                                <button type="submit" className="btn btn-gold btn-full" disabled={loading} id="submit-contact">
                                    {loading ? 'Sending...' : '✉️ Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
