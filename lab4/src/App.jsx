import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import WeeklyForecast from './components/WeeklyForecast';
import CitySuggestions from './components/CitySuggestions';
import { fetchWeatherData, fetchWeatherForecast, getCitySuggestions } from './utils/weatherApi';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = async (city) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData(null);

    try {
      const [currentWeather, forecastWeather] = await Promise.all([
        fetchWeatherData(city),
        fetchWeatherForecast(city)
      ]);
      
      setWeatherData(currentWeather);
      setForecastData(forecastWeather);
    } catch (err) {
      setError(err.message || 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCitySuggestions([]);
    handleSearch(city);
  };

  const handleInputChange = async (value) => {
    setSelectedCity(value);
    setError(null);
    
    if (value.length > 2) {
      try {
        const suggestions = await getCitySuggestions(value);
        setCitySuggestions(suggestions);
      } catch (error) {
        console.warn('Failed to fetch city suggestions:', error);
        setCitySuggestions([]);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Weather App</h1>
      
      <SearchBar
        onSearch={handleSearch}
        onInputChange={handleInputChange}
        value={selectedCity}
        loading={loading}
      />
      
      {citySuggestions.length > 0 && (
        <CitySuggestions
          suggestions={citySuggestions}
          onSelect={handleCitySelect}
        />
      )}
      
      {loading && <div className="loading">Loading weather data...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {weatherData && (
        <div className="weather-container">
          <WeatherDisplay data={weatherData} />
          {forecastData && <WeeklyForecast data={forecastData} />}
        </div>
      )}
    </div>
  );
}

export default App;
