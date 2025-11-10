import React from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, onInputChange, value, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleInputChange = (e) => {
    onInputChange(e.target.value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Enter city name..."
          value={value}
          onChange={handleInputChange}
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
