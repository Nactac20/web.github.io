import React from 'react';
import '../styles/WeatherDetails.css';

function WeatherDetails({ data, t }) {
  if (!data) return null;

  const { temperature, feels_like, humidity, pressure, windSpeed, cloudiness, description, icon, sunrise, sunset } = data;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="weather-details-component">
      <div className="weather-details-card">
        <div className="weather-details-middle">
          <div className="vertical-block-left">
            <div className="detail-item">
              <div className="detail-icon">🌅</div>
              <div className="detail-label">{t('sunrise')}</div>
              <div className="detail-value">{formatTime(sunrise)}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">🌇</div>
              <div className="detail-label">{t('sunset')}</div>
              <div className="detail-value">{formatTime(sunset)}</div>
            </div>
          </div>
          
          <div className="weather-details-header">
            <div className="weather-icon">
              {getWeatherIcon(icon)}
            </div>
            <div className="main-temp">
              {Math.round(temperature)}°C
            </div>
            <div className="feels-like">
              {t('feelsLike')} {feels_like}°C
            </div>
            <div className="weather-description">
              {t(description, description)}
            </div>
          </div>
          
          <div className="vertical-block-right">
            <div className="detail-item">
              <div className="detail-icon">💧</div>
              <div className="detail-label">{t('humidity')}</div>
              <div className="detail-value">{humidity}%</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">📊</div>
              <div className="detail-label">{t('pressure')}</div>
              <div className="detail-value">{pressure} hPa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDetails;
