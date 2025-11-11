import React from 'react';
import '../styles/CitySuggestions.css';

function CitySuggestions({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="city-suggestions">
      {suggestions.map((suggestion, index) => (
        <div 
          key={index}
          className="city-suggestion-item"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}

export default CitySuggestions;
