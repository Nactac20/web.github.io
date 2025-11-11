import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import WeatherDetails from './components/WeatherDetails';
import WeeklyForecast from './components/WeeklyForecast';
import HourlyForecast from './components/HourlyForecast';
import CitySuggestions from './components/CitySuggestions';
import SearchHistory from './components/SearchHistory';
import ErrorBoundary from './components/ErrorBoundary';
import { getTranslation } from './utils/translations';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  
  const [cityInput, setCityInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [usingLocation, setUsingLocation] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const [currentLang, setCurrentLang] = useState('en');

  const t = (key) => getTranslation(currentLang, key);

  const loadWeatherData = async (city) => {
    if (!city.trim()) {
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const { 
        fetchWeatherData, 
        fetchWeatherForecast, 
        getCitySuggestions 
      } = await import('./utils/weatherApi');
      
      const [currentWeatherData, forecastData] = await Promise.all([
        fetchWeatherData(city),
        fetchWeatherForecast(city)
      ]);
      
      setCurrentWeather(currentWeatherData);
      setForecast(forecastData);
      setShowSuggestions(false);
      
      addToSearchHistory(city);
      
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const addToSearchHistory = (city) => {
    setSearchHistory(prev => {
      const newHistory = [city, ...prev.filter(item => item !== city)];
    return newHistory.slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleSearchFromHistory = (city) => {
    handleSearch(city);
    setShowHistory(false);
  };

  const loadWeatherByCoords = async (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const { 
        fetchWeatherDataByLocation, 
        fetchWeatherForecastByLocation 
      } = await import('./utils/weatherApi');
      
      const [currentWeatherData, forecastData] = await Promise.all([
        fetchWeatherDataByLocation(lat, lon),
        fetchWeatherForecastByLocation(lat, lon)
      ]);
      
      setCurrentWeather(currentWeatherData);
      setForecast(forecastData);
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSearch = (city) => {
    if (!city.trim()) {
      return;
    }
    
    setUsingLocation(false);
    setCityInput(city);
    loadWeatherData(city);
  };

  const handleInputChange = (value) => {
    setCityInput(value);
    setUsingLocation(false);
    
    if (value.length > 2) {
      fetchCitySuggestions(value);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
    
    if (value.length === 0 && searchHistory.length > 0) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  const fetchCitySuggestions = async (input) => {
    try {
      const { getCitySuggestions } = await import('./utils/weatherApi');
      const suggestions = await getCitySuggestions(input);
      setCitySuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.warn('Failed to fetch city suggestions:', error);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (city) => {
    handleSearch(city);
  };

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      setWeatherError('Geolocation is not supported by this browser.');
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUsingLocation(true);
        setCityInput('');
        loadWeatherByCoords(latitude, longitude);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }
        setWeatherError(errorMessage);
        setWeatherLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleLanguageToggle = () => {
    setCurrentLang(currentLang === 'en' ? 'ru' : 'en');
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <div className="search-container">
          <div className="search-bar-container" style={{ position: 'relative' }}>
            <SearchBar
              onSearch={handleSearch}
              onInputChange={handleInputChange}
              value={cityInput}
              loading={weatherLoading}
              language={currentLang}
            />
            
            {showSuggestions && citySuggestions.length > 0 && (
              <CitySuggestions
                suggestions={citySuggestions}
                onSelect={handleCitySelect}
              />
            )}
            
            {showHistory && searchHistory.length > 0 && cityInput.length === 0 && (
              <SearchHistory
                history={searchHistory}
                onSelectCity={handleSearchFromHistory}
                onClearHistory={clearSearchHistory}
                language={currentLang}
              />
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              type="button" 
              className="location-button-app"
              onClick={handleLocationDetection}
              disabled={weatherLoading}
              title={t('myLocation')}
            >
              {t('myLocation')}
            </button>
            
            <button 
              type="button" 
              className="language-button"
              onClick={handleLanguageToggle}
            >
              {currentLang === 'en' ? 'RU' : 'EN'}
            </button>
          </div>
        </div>
        
        {weatherLoading && (
          <div className="loading">{t('loading')}</div>
        )}
        
        {weatherError && (
          <div className="error">
            {weatherError}
          </div>
        )}
        
        {currentWeather && (
          <div className="weather-container">
            <div className="current-weather-section">
              <WeatherDisplay 
                data={currentWeather} 
                language={currentLang}
              />
              <WeatherDetails 
                data={currentWeather} 
                t={t}
                language={currentLang}
              />
            </div>
            
            <div className="forecast-section">
              {forecast && (
                <>
                  <HourlyForecast 
                    data={forecast.list} 
                    language={currentLang}
                  />
                  <WeeklyForecast 
                    data={forecast.daily} 
                    t={t}
                    language={currentLang}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
