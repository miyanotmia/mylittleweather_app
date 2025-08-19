import React, {useState} from 'react';
import './Styles/styles.css'
const App = () => {
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
            'Clear': 'public/Assets/sunny.png',
            'Clouds': 'public/Assets/cloudy.png',
            'Rain': 'public/Assets/rainy.png',
            'Snow': 'public/Assets/snow.png',
            'Thunderstorm': 'public/Assets/storm.png',
            'Fog': 'public/Assets/windy.png'
        }; return iconPaths[weatherMain] || '/mylittleweather_app/public/Assets/sunny.png' 
       };
       const handleSearch = () => {
        checkWeather(cityInput);
       };
       const handleKeyPress = (e) => {
        if (e.key === 'Enter'){
            handleSearch();
        }
       }; return (<div className="card"> 
            <div className="search"> 
                <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city name"
                    disabled={loading}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
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
                <div className="weather"> 
                    <img 
                        src={weatherData.icon} 
                        alt="weather icon" 
                        className="weather-icon"
                    />
                    <h1>{weatherData.temp}</h1>
                    <h2>{weatherData.city}</h2>

                    <div className="details"> 
                        <div className="col">
                            <img src="/Assets/humidity.png" alt="humidity icon" />
                            <div>
                                <p className="humidity">{weatherData.humidity}</p>
                                <p>Humidity</p>
                            </div>
                        </div>
                        <div className="col">
                            <img src="/Assets/wind.png" alt="wind icon" />
                            <div>
                                <p className="wind">{weatherData.windSpeed}</p>
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App; 