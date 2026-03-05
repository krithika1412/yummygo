# 🍽 Foodify — Premium Restaurant Website

Full-stack restaurant website with menu browsing, table reservations, and admin dashboard.

## Tech Stack

| Layer | Technology | Hosting |
|-------|-----------|---------|
| Frontend | React (Vite) | Netlify |
| Backend | Python (Flask) | Vercel |
| Auth & DB | Supabase | - |

## Project Structure

```
yummygo/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Navbar, Hero, Cards, Footer, etc.
│       ├── pages/        # Home, Menu, Reservation, Contact, Login, Admin
│       ├── context/      # AuthContext (Supabase)
│       └── services/     # API service + Supabase client
├── server/          # Python Flask API
│   ├── api/         # Vercel entry point
│   ├── routes/      # menu, reservations, contact, restaurants
│   └── middleware/   # JWT auth
```

## Setup

### 1. Frontend
```bash
cd client
cp .env.example .env        # Add your Supabase keys
npm install
npm run dev                  # → localhost:5173
```

### 2. Backend
```bash
cd server
cp .env.example .env         # Add your Supabase keys
pip install -r requirements.txt
python api/index.py          # → localhost:5000
```

### 3. Supabase
Create these tables in your Supabase dashboard:

- **menu_items**: id (uuid), name, description, price, image_url, category, is_available, created_at
- **reservations**: id (uuid), name, email, phone, date, time, guests, status, created_at
- **contacts**: id (uuid), name, email, phone, subject, message, created_at
- **restaurants**: id (uuid), name, description, image_url, cuisine, rating, address, is_featured, discount_text

## Deployment

### Frontend → Netlify
1. Connect your repo
2. Build command: `cd client && npm run build`
3. Publish directory: `client/dist`
4. Add env vars in Netlify dashboard

### Backend → Vercel
1. Connect your repo
2. Root directory: `server`
3. Add env vars in Vercel dashboard
