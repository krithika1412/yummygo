import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'Min 6 characters';
        if (!isLogin && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setLoading(true);
        setMessage('');
        try {
            if (isLogin) {
                const { error } = await signIn(form.email, form.password);
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await signUp(form.email, form.password);
                if (error) throw error;
                setMessage('Account created! Check your email for verification.');
            }
        } catch (err) {
            setMessage(err.message || 'An error occurred');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    return (
        <div className="page">
            <section className="login-page" id="login-page">
                <div className="login-card animate-fade-in-up">
                    <div className="login-header">
                        <h2><span className="text-gold">🍽</span> {isLogin ? 'Welcome Back' : 'Join Foodify'}</h2>
                        <p>{isLogin ? 'Sign in to your account' : 'Create your account to start booking'}</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate id="login-form">
                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input type="email" id="login-email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input type="password" id="login-password" name="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="••••••••" value={form.password} onChange={handleChange} />
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="login-confirm">Confirm Password</label>
                                <input type="password" id="login-confirm" name="confirmPassword" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
                                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                            </div>
                        )}

                        {message && <div className={`login-message ${message.includes('error') || message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                        <button type="submit" className="btn btn-gold btn-full" disabled={loading} id="submit-login">
                            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="login-toggle">
                        <p>
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setErrors({}); setMessage(''); }}>
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
