import React from 'react';
import '../styles/WeatherDisplay.css';

function WeatherDisplay({ data }) {
  if (!data) return null;

  const { city, temperature, humidity, windSpeed, cloudiness, description, icon } = data;

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  return (
    <div className="weather-display">
      <div className="weather-card">
        <div className="weather-main">
          <h2 className="city-name">{city}</h2>
          
          <div className="temperature-section">
            <div className="weather-icon">
              {getWeatherIcon(icon)}
            </div>
            <div className="temperature">
              {Math.round(temperature)}°C
            </div>
            <div className="weather-description">
              {description}
            </div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <div className="detail-icon">💨</div>
            <div className="detail-label">Wind</div>
            <div className="detail-value">{windSpeed} m/s</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">💧</div>
            <div className="detail-label">Humidity</div>
            <div className="detail-value">{humidity}%</div>
          </div>
          
          <div className="detail-item">
            <div className="detail-icon">☁️</div>
            <div className="detail-label">Clouds</div>
            <div className="detail-value">{cloudiness}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;
