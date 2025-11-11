import React from 'react';
import '../styles/HourlyForecast.css';
import { getTranslation } from '../utils/translations';

function HourlyForecast({ data, language = 'en' }) {
  if (!data || data.length === 0) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWindDirection = (degrees) => {
    const directions = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

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
    <div className="hourly-forecast">
      <h3 className="hourly-forecast-title">{getTranslation(language, 'hourlyForecast')}</h3>
      <div className="hourly-container">
        {data.slice(0, 5).map((hour, index) => (
          <div key={index} className="hourly-item">
            <div className="hourly-time">{formatTime(hour.dt_txt)}</div>
            <div className="hourly-weather-icon">
              {getWeatherIcon(hour.weather[0].icon)}
            </div>
            <div className="hourly-temp">{Math.round(hour.main.temp)}°</div>
            <div className="hourly-wind">
              💨 {Math.round(hour.wind.speed)} м/с {formatWindDirection(hour.wind.deg || 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
