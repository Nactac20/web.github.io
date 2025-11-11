import React from 'react';
import '../styles/SearchBar.css';
import { getTranslation } from '../utils/translations';

function SearchBar({ onSearch, onInputChange, value, loading, language = 'en' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  const onInputChangeHandler = (e) => {
    onInputChange(e.target.value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder={getTranslation(language, 'enterCityName')}
          value={value}
          onChange={onInputChangeHandler}
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading}
        >
          {loading ? getTranslation(language, 'searching') : getTranslation(language, 'search')}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
