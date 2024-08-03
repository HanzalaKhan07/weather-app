import React, { useState } from "react";
import "./WeatherApp.css";
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";

const WeatherApp = () => {
  const api_key = process.env.REACT_APP_API_KEY;
  const [weatherIcon, setWeatherIcon] = useState(cloud_icon);
  const [place, setPlace] = useState('');

  const search = async () => {
    if (!place) return;

    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${api_key}`;
      let response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      let data = await response.json();
      
      if (!data.weather || !data.weather[0]) {
        throw new Error('Weather data not available');
      }

      // Update weather icon based on weather data
      switch (data.weather[0].icon) {
        case "01d":
        case "01n":
          setWeatherIcon(clear_icon);
          break;
        case "02d":
        case "02n":
          setWeatherIcon(cloud_icon);
          break;
        case "03d":
        case "03n":
          setWeatherIcon(drizzle_icon);
          break;
        case "09d":
        case "09n":
          setWeatherIcon(rain_icon);
          break;
        case "13d":
        case "13n":
          setWeatherIcon(snow_icon);
          break;
        default:
          setWeatherIcon(clear_icon);
          break;
      }
      
      // Update weather data in the component
      document.querySelector(".humidity-percent").innerHTML = data.main.humidity + " %";
      document.querySelector(".wind-rate").innerHTML = Math.floor(data.wind.speed) + " km/h";
      document.querySelector(".weather-temp").innerHTML = Math.floor(data.main.temp) + " *C";
      document.querySelector(".weather-location").innerHTML = data.name;
    } catch (error) {
      console.error(error.message);
      // Display an error message to the user
      alert("City not found or invalid data");
      // Reset the weather data
      setWeatherIcon(cloud_icon); // or any default icon
      document.querySelector(".humidity-percent").innerHTML = "";
      document.querySelector(".wind-rate").innerHTML = "";
      document.querySelector(".weather-temp").innerHTML = "";
      document.querySelector(".weather-location").innerHTML = "";
    }
  };

  const handleInputChange = (event) => {
    setPlace(event.target.value);
  };

  const handleSearch = () => {
    search();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <input 
          type="text" 
          value={place} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown} 
          placeholder="Enter place name" 
        />
        <div
          className="search-icon"
          onClick={handleSearch}
        >
          <img src={search_icon} alt="Search" />
        </div>
      </div>
      <div className="weather-image">
        <img src={weatherIcon} alt="Weather Icon" />
      </div>
      <div className="weather-temp">24*C</div>
      <div className="weather-location">London</div>
      <div className="data-container">
        <div className="element">
          <img src={humidity_icon} alt="Humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">65%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={wind_icon} alt="Wind Speed" className="icon" />
          <div className="data">
            <div className="wind-rate">18 km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
