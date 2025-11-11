import React from 'react';
import '../styles/WeatherDisplay.css';
import { getTranslation } from '../utils/translations';

function WeatherDisplay({ data, language = 'en' }) {
  if (!data) return null;

  const { city, icon } = data;

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    const dayIndex = now.getDay();
    const monthIndex = now.getMonth();
    const day = now.getDate();
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    
    const dayName = getTranslation(language, dayNames[dayIndex]);
    const monthName = getTranslation(language, monthNames[monthIndex]);
    
    if (language === 'ru') {
      return `${dayName}, ${day} ${monthName}`;
    } else {
      return `${dayName}, ${day} ${monthName}`;
    }
  };

  return (
    <div className="weather-display">
      <div className="weather-card">
        <div className="weather-main">
          <h2 className="city-name">{city}</h2>
          
          <div className="temperature-section">
            <div className="current-time">
              {getCurrentTime()}
            </div>
            <div className="current-date">
              {getCurrentDate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;
