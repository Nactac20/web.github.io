import React from 'react';
import '../styles/CitySuggestions.css';

function CitySuggestions({ suggestions, onSelect }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="city-suggestions">
      <div className="suggestions-list">
        {suggestions.map((city, index) => (
          <div
            key={index}
            className="suggestion-item"
            onClick={() => onSelect(city)}
          >
            {city}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CitySuggestions;
