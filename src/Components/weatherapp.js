import React, {useState} from 'react';
import './Styles/styles.css'
const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState({
        city: 'Philadelphia',
        temp: '75°F',
        humidity: '50%',
        windSpeed: '6 mph',
        icon: '/Assets/Sunny.png'
    });
    const [cityInput, setCityInput]= useState('');
    const [loading, setLoading]= useState(false);
    const [error, setError] = useState('');

    const apiKey =  "565246e95a2b8da9c87c44afa6b2376b";
    const weatherApi = "https://api.openweathermap.org/data/2.5/weather?";
    const geoApi = "http://api.openweathermap.org/geo/1.0/direct?";

    const checkWeather = async (cityName) => {
        if (!cityName.trim()) return;

        setLoading(true);
        setError('');

        try{
            const geoResponse = await fetch(`${geoApi}q=${cityName}&limit=1&appid=${apiKey}`)
            const geoData = await geoResponse.json();
            if (geoData.length === 0){
                throw new Error('City not found');
            }

            const {lat, lon}= geoData[0];
            const weatherResponse = await fetch(`${weatherApi}lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
            const data= await weatherResponse.json();

            setWeatherData({
                city: data.name,
                temp: Math.round(data.main.temp) + '°F',
                humidity: data.main.humidity + '%',
                windSpeed: Math.round(data.wind.speed) + ' mph',
                icon: getWeatherIcon(data.weather[0].main)
            });
        } catch (error){
            setError ('Error fetching weather data.Please try again.');
            console.error("Error fetching weather data:", error);
        } finally{
            setLoading(false);
        }
    };
    const getWeatherIcon = (weatherMain) => {
        const iconPaths={
            'Clear': '/Assets/sunny.png',
            'Clouds': '/Assets/cloudy.png',
            'Rain': '/Assets/rainy.png',
            'Snow': '/Assets/snow.png',
            'Thunderstorm': '/Assets/storm.png',
            'Fog': '/Assets/windy.png'
        }; return iconPaths[weatherMain] || '/mylittleweather_app/public/Assets/sunny.png' 
       };
       const handleSearch = () => {
        checkWeather(cityInput);
       };
       const handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            handleSearch();
        }
       }; return (<div className="weather-app">
            <div className="weather-card">
                
                <div className="search-container">
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter city name"
                        className="search-input"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="search-button"
                    >
                        🔍
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading weather data...</p>
                    </div>
                ) : (
                    <div className="weather-display">
                        <div className="weather-main">
                            {weatherData.icon.startsWith('/Assets/') ? (
                                <img 
                                    src={weatherData.icon} 
                                    alt="weather icon" 
                                    className="weather-icon-img"
                                />
                            ) : (
                                <div className="weather-icon-emoji">
                                    {weatherData.icon}
                                </div>
                            )}
                            <h1 className="temperature">
                                {weatherData.temp}
                            </h1>
                            <h2 className="city-name">
                                {weatherData.city}
                            </h2>
                        </div>

                        <div className="weather-details">
                            <div className="detail-item">
                                <div className="detail-icon">💧</div>
                                <p className="detail-value">{weatherData.humidity}</p>
                                <p className="detail-label">Humidity</p>
                            </div>
                            <div className="detail-item">
                                <div className="detail-icon">💨</div>
                                <p className="detail-value">{weatherData.windSpeed}</p>
                                <p className="detail-label">Wind Speed</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default WeatherApp