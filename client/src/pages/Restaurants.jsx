import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import { api } from '../services/api';
import './Restaurants.css';

export default function Restaurants() {
    const [searchParams] = useSearchParams();
    const [restaurants, setRestaurants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [cuisines, setCuisines] = useState([]);
    const [cities, setCities] = useState([]);
    const [activeCuisine, setActiveCuisine] = useState('All');
    const [activeCity, setActiveCity] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getRestaurants().then(data => {
            if (data && data.length > 0) {
                setRestaurants(data);
                // Extract unique cuisines and cities
                const uniqueCuisines = [...new Set(data.map(r => r.cuisine).filter(Boolean))].sort();
                const uniqueCities = [...new Set(data.map(r => r.city).filter(Boolean))].sort();
                setCuisines(uniqueCuisines);
                setCities(uniqueCities);

                // Check for cuisine query param from category navigation
                const cuisineParam = searchParams.get('cuisine');
                if (cuisineParam) {
                    setActiveCuisine(cuisineParam);
                }
            }
            setLoading(false);
        }).catch(() => { setLoading(false); });
    }, [searchParams]);

    // Apply filters whenever restaurants, search, cuisine, or city changes
    useEffect(() => {
        let result = [...restaurants];

        if (search) {
            const s = search.toLowerCase();
            result = result.filter(r =>
                r.name.toLowerCase().includes(s) ||
                r.cuisine?.toLowerCase().includes(s) ||
                r.city?.toLowerCase().includes(s) ||
                r.address?.toLowerCase().includes(s)
            );
        }

        if (activeCuisine && activeCuisine !== 'All') {
            result = result.filter(r => r.cuisine === activeCuisine);
        }

        if (activeCity && activeCity !== 'All') {
            result = result.filter(r => r.city === activeCity);
        }

        setFiltered(result);
    }, [restaurants, search, activeCuisine, activeCity]);

    const handleFilter = ({ cuisine, sort }) => {
        setActiveCuisine(cuisine);
        // Sort is handled in the filtered array
    };

    const handleCityChange = (city) => {
        setActiveCity(city);
    };

    // Group restaurants by cuisine for display
    const groupedByCuisine = {};
    filtered.forEach(r => {
        const cuisine = r.cuisine || 'Other';
        if (!groupedByCuisine[cuisine]) groupedByCuisine[cuisine] = [];
        groupedByCuisine[cuisine].push(r);
    });

    return (
        <div className="page">
            <section className="restaurants-page section" id="restaurants-page">
                <div className="container">
                    <div className="section-title">
                        <div className="gold-line"></div>
                        <h2>All Restaurants</h2>
                        <p>Browse {restaurants.length}+ restaurants across India</p>
                    </div>

                    <div className="search-bar-wrapper">
                        <input
                            type="text"
                            className="form-input search-bar"
                            placeholder="🔍 Search by name, cuisine, or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            id="restaurant-search"
                        />
                    </div>

                    <FilterBar
                        onFilter={handleFilter}
                        cuisines={cuisines}
                        cities={cities}
                        onCityChange={handleCityChange}
                        activeCity={activeCity}
                    />

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Loading restaurants...</p>
                        </div>
                    ) : activeCuisine !== 'All' ? (
                        // Flat list when filtering by specific cuisine
                        <>
                            <div className="cuisine-header">
                                <h3>{activeCuisine} Restaurants ({filtered.length})</h3>
                            </div>
                            <div className="restaurant-grid grid grid-4">
                                {filtered.map(r => (
                                    <RestaurantCard key={r.id} restaurant={r} />
                                ))}
                            </div>
                        </>
                    ) : (
                        // Grouped by cuisine when showing all
                        Object.entries(groupedByCuisine).map(([cuisine, items]) => (
                            <div key={cuisine} className="cuisine-group">
                                <div className="cuisine-header">
                                    <h3>{cuisine} <span className="cuisine-count">({items.length})</span></h3>
                                </div>
                                <div className="restaurant-grid grid grid-4">
                                    {items.map(r => (
                                        <RestaurantCard key={r.id} restaurant={r} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && filtered.length === 0 && (
                        <div className="empty-state">
                            <p>No restaurants found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
