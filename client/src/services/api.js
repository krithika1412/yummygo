import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        return { Authorization: `Bearer ${session.access_token}` };
    }
    return {};
}

async function request(endpoint, options = {}) {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    // Menu
    getMenu: (category) => request(`/menu${category ? `?category=${category}` : ''}`),
    addMenuItem: (data) => request('/menu', { method: 'POST', body: JSON.stringify(data) }),
    updateMenuItem: (id, data) => request(`/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMenuItem: (id) => request(`/menu/${id}`, { method: 'DELETE' }),

    // Reservations
    getReservations: () => request('/reservations'),
    createReservation: (data) => request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
    updateReservation: (id, data) => request(`/reservations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),

    // Restaurants
    getRestaurants: (params = '') => request(`/restaurants${params ? `?${params}` : ''}`),
    updateRestaurant: (id, data) => request(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Contact
    submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
    getContacts: () => request('/contact'),

    // AI Chat
    sendChatMessage: (message, history = []) =>
        request('/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),
};
