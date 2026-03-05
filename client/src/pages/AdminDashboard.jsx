import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './AdminDashboard.css';

const tabs = ['Menu Items', 'Reservations', 'Restaurants', 'Enquiries'];

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Menu Items');
    const [menuItems, setMenuItems] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'Main Course', image_url: '', is_available: true });
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [tableForm, setTableForm] = useState({ available_tables: 0 });

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
    }, [user, authLoading, navigate]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [m, r, c, rest] = await Promise.all([
                api.getMenu().catch(() => []),
                api.getReservations().catch(() => []),
                api.getContacts().catch(() => []),
                api.getRestaurants().catch(() => [])
            ]);
            if (m.length) setMenuItems(m);
            if (r.length) setReservations(r);
            if (c.length) setContacts(c);
            if (rest.length) setRestaurants(rest);
        } catch { }
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editItem) {
                await api.updateMenuItem(editItem.id, { ...menuForm, price: Number(menuForm.price) });
            } else {
                await api.addMenuItem({ ...menuForm, price: Number(menuForm.price) });
            }
            loadData();
        } catch { }
        setShowForm(false); setEditItem(null);
        setMenuForm({ name: '', description: '', price: '', category: 'Main Course', image_url: '', is_available: true });
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setMenuForm({ name: item.name, description: item.description || '', price: item.price?.toString() || '', category: item.category || 'Main Course', image_url: item.image_url || '', is_available: item.is_available ?? true });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try { await api.deleteMenuItem(id); loadData(); } catch { }
    };

    const handleReservationStatus = async (id, status) => {
        try { await api.updateReservation(id, { status }); loadData(); } catch { }
    };

    const handleUpdateTables = async (restaurantId) => {
        try {
            await api.updateRestaurant(restaurantId, { available_tables: Number(tableForm.available_tables) });
            loadData();
        } catch { }
        setEditingRestaurant(null);
    };

    const startEditTables = (rest) => {
        setEditingRestaurant(rest.id);
        setTableForm({ available_tables: rest.available_tables || 0 });
    };

    if (authLoading) return <div className="page"><div className="loading-state">Loading...</div></div>;

    return (
        <div className="page">
            <section className="admin-page section" id="admin-dashboard">
                <div className="container">
                    <div className="admin-header">
                        <h2>Admin Dashboard</h2>
                        <p className="text-muted">Manage your restaurant content</p>
                    </div>

                    <div className="admin-tabs">
                        {tabs.map(tab => (
                            <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* MENU ITEMS TAB */}
                    {activeTab === 'Menu Items' && (
                        <div className="admin-panel animate-fade-in" id="menu-panel">
                            <div className="panel-header">
                                <h3>Menu Items ({menuItems.length})</h3>
                                <button className="btn btn-gold btn-sm" onClick={() => { setShowForm(true); setEditItem(null); setMenuForm({ name: '', description: '', price: '', category: 'Main Course', image_url: '', is_available: true }); }}>
                                    + Add Item
                                </button>
                            </div>

                            {showForm && (
                                <form className="admin-form" onSubmit={handleMenuSubmit} id="menu-form">
                                    <h4>{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</h4>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" className="form-input" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Price (₹)</label>
                                            <input type="number" className="form-input" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea className="form-input" rows="2" value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <select className="form-input" value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}>
                                                <option>Starters</option><option>Main Course</option><option>Desserts</option><option>Beverages</option><option>Specials</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input type="url" className="form-input" value={menuForm.image_url} onChange={e => setMenuForm({ ...menuForm, image_url: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-gold btn-sm">{editItem ? 'Update' : 'Add'}</button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={() => { setShowForm(false); setEditItem(null); }}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            <div className="admin-table-wrapper">
                                <table className="admin-table" id="menu-table">
                                    <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {menuItems.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td><span className="badge badge-gold">{item.category}</span></td>
                                                <td className="text-gold">₹{item.price}</td>
                                                <td><span className={`badge ${item.is_available ? 'badge-success' : 'badge-danger'}`}>{item.is_available ? 'Available' : 'Unavailable'}</span></td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn btn-dark btn-xs" onClick={() => handleEdit(item)}>Edit</button>
                                                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(item.id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {menuItems.length === 0 && <tr><td colSpan="5" className="text-center text-muted">No menu items yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* RESERVATIONS TAB */}
                    {activeTab === 'Reservations' && (
                        <div className="admin-panel animate-fade-in" id="reservations-panel">
                            <div className="panel-header"><h3>Reservations ({reservations.length})</h3></div>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>Name</th><th>Email</th><th>Date</th><th>Time</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {reservations.map(r => (
                                            <tr key={r.id}>
                                                <td>{r.name}</td>
                                                <td>{r.email}</td>
                                                <td>{r.date}</td>
                                                <td>{r.time}</td>
                                                <td>{r.guests}</td>
                                                <td>
                                                    <span className={`badge ${r.status === 'confirmed' ? 'badge-success' : r.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                                                        {r.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn btn-gold btn-xs" onClick={() => handleReservationStatus(r.id, 'confirmed')}>Confirm</button>
                                                        <button className="btn btn-danger btn-xs" onClick={() => handleReservationStatus(r.id, 'cancelled')}>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {reservations.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No reservations yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* RESTAURANTS TAB */}
                    {activeTab === 'Restaurants' && (
                        <div className="admin-panel animate-fade-in" id="restaurants-panel">
                            <div className="panel-header"><h3>Restaurants — Table Availability ({restaurants.length})</h3></div>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>Name</th><th>City</th><th>Cuisine</th><th>Total Tables</th><th>Available</th><th>Status</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {restaurants.map(r => (
                                            <tr key={r.id}>
                                                <td><strong>{r.name}</strong></td>
                                                <td>{r.city || '—'}</td>
                                                <td><span className="badge badge-gold">{r.cuisine}</span></td>
                                                <td>{r.total_tables || 0}</td>
                                                <td>
                                                    {editingRestaurant === r.id ? (
                                                        <input type="number" className="form-input table-input" min="0" max={r.total_tables || 50} value={tableForm.available_tables} onChange={e => setTableForm({ available_tables: e.target.value })} />
                                                    ) : (
                                                        <strong className="text-gold">{r.available_tables || 0}</strong>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${(r.available_tables || 0) > 0 ? 'badge-success' : 'badge-danger'}`}>
                                                        {(r.available_tables || 0) > 0 ? 'Available' : 'Full'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-btns">
                                                        {editingRestaurant === r.id ? (
                                                            <>
                                                                <button className="btn btn-gold btn-xs" onClick={() => handleUpdateTables(r.id)}>Save</button>
                                                                <button className="btn btn-dark btn-xs" onClick={() => setEditingRestaurant(null)}>Cancel</button>
                                                            </>
                                                        ) : (
                                                            <button className="btn btn-dark btn-xs" onClick={() => startEditTables(r)}>Update Tables</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {restaurants.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No restaurants found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ENQUIRIES TAB */}
                    {activeTab === 'Enquiries' && (
                        <div className="admin-panel animate-fade-in" id="enquiries-panel">
                            <div className="panel-header"><h3>Contact Enquiries ({contacts.length})</h3></div>
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th></tr></thead>
                                    <tbody>
                                        {contacts.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.name}</td>
                                                <td>{c.email}</td>
                                                <td>{c.subject}</td>
                                                <td className="message-cell">{c.message}</td>
                                                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                        {contacts.length === 0 && <tr><td colSpan="5" className="text-center text-muted">No enquiries yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
