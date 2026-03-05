import { useState } from 'react';
import './FilterBar.css';

const defaultCuisines = ['All', 'North Indian', 'South Indian', 'Mughlai', 'Continental', 'Chinese', 'Seafood', 'Street Food', 'Fine Dining'];
const sortOptions = ['Relevance', 'Rating', 'Price: Low to High', 'Price: High to Low'];

export default function FilterBar({ onFilter, cuisines, cities, onCityChange, activeCity }) {
    const cuisineList = cuisines && cuisines.length > 0 ? ['All', ...cuisines] : defaultCuisines;
    const [activeCuisine, setActiveCuisine] = useState('All');
    const [sortBy, setSortBy] = useState('Relevance');

    const handleCuisine = (c) => {
        setActiveCuisine(c);
        onFilter?.({ cuisine: c, sort: sortBy });
    };

    const handleSort = (e) => {
        setSortBy(e.target.value);
        onFilter?.({ cuisine: activeCuisine, sort: e.target.value });
    };

    return (
        <div className="filter-bar" id="filter-bar">
            <div className="filter-chips">
                {cuisineList.map(c => (
                    <button
                        key={c}
                        className={`filter-chip ${activeCuisine === c ? 'active' : ''}`}
                        onClick={() => handleCuisine(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>
            <div className="filter-controls">
                {cities && cities.length > 0 && (
                    <select className="filter-sort" value={activeCity || 'All'} onChange={(e) => onCityChange?.(e.target.value)} id="city-select">
                        <option value="All">📍 All Cities</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                )}
                <select className="filter-sort" value={sortBy} onChange={handleSort} id="sort-select">
                    {sortOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
