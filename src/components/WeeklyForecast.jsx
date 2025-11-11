import React from 'react';
import '../styles/WeeklyForecast.css';

function WeeklyForecast({ data, t }) {
  if (!data || data.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
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
    <div className="weekly-forecast">
      <h3 className="forecast-title">{t('fiveDayForecast')}</h3>
      <div className="forecast-container">
        {data.map((day, index) => (
          <div key={index} className="forecast-day">
            <div className="forecast-date">{formatDate(day.date)}</div>
            <div className="forecast-day-name">{day.dayName}</div>
            <div className="forecast-weather-icon">
              {getWeatherIcon(day.icon)}
            </div>
            
            <div className="forecast-temperatures">
              <span className="max-temp">{day.maxTemp}°</span>
              <span className="min-temp">{day.minTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyForecast;
