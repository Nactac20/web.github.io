import React from 'react';
import '../styles/SearchHistory.css';
import { getTranslation } from '../utils/translations';

function SearchHistory({ history, onSelectCity, onClearHistory, language = 'en' }) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="search-history-container">
      <div className="search-history-header">
        <h3 className="search-history-title">
          {getTranslation(language, 'recentSearches')}
        </h3>
        <button 
          className="clear-history-button"
          onClick={onClearHistory}
          title={getTranslation(language, 'clearHistory')}
        >
          {getTranslation(language, 'clearHistory')}
        </button>
      </div>
      
      <div className="search-history-list">
        {history.map((city, index) => (
          <div 
            key={index}
            className="search-history-item"
            onClick={() => onSelectCity(city)}
          >
            <div className="history-city-name">{city}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;
