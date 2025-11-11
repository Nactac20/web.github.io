const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const isApiKeyConfigured = () => {
  return API_KEY && API_KEY !== 'your_openweathermap_api_key_here' && API_KEY.trim() !== '';
};

const transformWeatherData = (apiData) => {
  return {
    city: apiData.name,
    temperature: Math.round(apiData.main.temp),
    feels_like: Math.round(apiData.main.feels_like),
    humidity: apiData.main.humidity,
    pressure: apiData.main.pressure,
    windSpeed: Math.round(apiData.wind.speed * 10) / 10,
    cloudiness: apiData.clouds.all,
    description: apiData.weather[0].description,
    icon: apiData.weather[0].icon,
    sunrise: apiData.sys.sunrise,
    sunset: apiData.sys.sunset
  };
};

const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 404:
        throw new Error('City not found. Please check the city name');
      case 401:
        throw new Error('Invalid API key.');
      case 429:
        throw new Error('API rate limit exceeded.');
      default:
        throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    }
  } 
  else if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  } 
  else {
    throw new Error(`Request failed: ${error.message}`);
  }
};

export const fetchWeatherData = async (city) => {
  if (!isApiKeyConfigured()) {
    throw new Error('API key not configured.');
  }

  const trimmedCity = city.trim();
  if (!trimmedCity) {
    throw new Error('Please enter a valid city name.');
  }

  try {
    const url = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'API request failed');
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    const data = await response.json();

    return transformWeatherData(data);
    
  } catch (error) {
    console.error('Weather API Error:', error);
    handleApiError(error);
  }
};

export const fetchWeatherDataByLocation = async (lat, lon) => {
  if (!isApiKeyConfigured()) {
    throw new Error('API key not configured.');
  }

  if (lat === undefined || lon === undefined) {
    throw new Error('Latitude and longitude are required for location-based weather data.');
  }

  try {
    const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'API request failed');
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    const data = await response.json();

    return transformWeatherData(data);
    
  } catch (error) {
    console.error('Weather API Error:', error);
    handleApiError(error);
  }
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage;
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
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
};

export const fetchWeatherForecastByLocation = async (lat, lon) => {
  if (!isApiKeyConfigured()) {
    throw new Error('API key not configured.');
  }

  if (lat === undefined || lon === undefined) {
    throw new Error('Latitude and longitude are required for location-based weather forecast.');
  }

  try {
    const url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Forecast API request failed');
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    const data = await response.json();

    return transformForecastData(data);
    
  } catch (error) {
    console.error('Forecast API Error:', error);
    handleApiError(error);
  }
};

export const fetchWeatherForecast = async (city) => {
  if (!isApiKeyConfigured()) {
    throw new Error('API key not configured.');
  }

  const trimmedCity = city.trim();
  if (!trimmedCity) {
    throw new Error('Please enter a valid city name.');
  }

  try {
    const url = `${BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Forecast API request failed');
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    const data = await response.json();

    return transformForecastData(data);
    
  } catch (error) {
    console.error('Forecast API Error:', error);
    handleApiError(error);
  }
};

const transformForecastData = (apiData) => {
  const dailyForecasts = {};
  
  apiData.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date: date,
        temperatures: [],
        weatherItems: []
      };
    }
    
    dailyForecasts[date].temperatures.push(item.main.temp);
    dailyForecasts[date].weatherItems.push({
      description: item.weather[0].description,
      icon: item.weather[0].icon
    });
  });
  
  const forecastArray = Object.values(dailyForecasts).map(day => {
    const minTemp = Math.min(...day.temperatures);
    const maxTemp = Math.max(...day.temperatures);
    
    const noonWeather = day.weatherItems.find(w => w.description.includes('clear')) || 
                       day.weatherItems[Math.floor(day.weatherItems.length / 2)];

    const dateObj = new Date(day.date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    
    return {
      date: day.date,
      dayName: dayName,
      minTemp: Math.round(minTemp),
      maxTemp: Math.round(maxTemp),
      description: noonWeather.description,
      icon: noonWeather.icon
    };
  });

  return {
    list: apiData.list,
    daily: forecastArray.slice(0, 5)
  };
};

export const getCitySuggestions = async (input) => {
  if (!isApiKeyConfigured() || !input || input.length < 3) {
    return [];
  }

  try {
    const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Geocoding API request failed:', response.status);
      return [];
    }
    
    const data = await response.json();
    
    return data.map(location => {
      const { name, country, state } = location;
      return state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
    });
    
  } catch (error) {
    console.warn('Geocoding API Error:', error);
    return [];
  }
};
