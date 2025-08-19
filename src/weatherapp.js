import React, {useState} from 'react';
const weatherApp = () => {
    const [weatherData, setWeatherData] = useState({
        city: 'Philadelphia',
        temp: '75°F',
        humidity: '50%',
        windSpeed: '6 mph',
        icon: ''
    });
    const [cityInput, setCityInput]= useState('');
    const [loading, setLoading]= useState(false);
    const [error, setError] = useState('');

    const apiKey = async ("565246e95a2b8da9c87c44afa6b2376b");
    const weatherApi = "https://api.openweathermap.org/data/2.5/weather?";
    const geoApi = "http://api.openweathermap.org/geo/1.0/direct?"

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
    const
}