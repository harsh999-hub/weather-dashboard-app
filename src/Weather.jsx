import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

const API_KEY = "1c73024fc1bb36cde9a939b54545e531";

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    setWeather(data);

    setLoading(false);
  };

  return (
    <div>
      <h1>🌦 Weather App</h1>

      <input
        type="text"
        placeholder="Enter city"
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={getWeather}>Search</button>

      {loading && <p>Loading...</p>}

      {weather && weather.cod === "404" && <p>City not found</p>}

      {weather && weather.main && (
        <div>
          <h2>{weather.name}</h2>
          <p>🌡 Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>☁️ {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}