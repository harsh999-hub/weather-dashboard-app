import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [filterTemp, setFilterTemp] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  
  const [unit, setUnit] = useState("C"); 
  const [history, setHistory] = useState([]); 
  const [notes, setNotes] = useState({}); 

  const API_KEY = "9303a6b4c34b05229953e88485483205";

  const toF = (c) => Math.round((c * 9) / 5 + 32);
  const showTemp = (c) => (unit === "C" ? `${c}°C` : `${toF(c)}°F`);

  const getWeather = async () => {
    if (!city) return;
    setError("");
    setLoading(true);

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (res.ok) {
      setWeather((prev) => [...prev, { ...data, favorite: false }]);

      
      setHistory((prev) => {
        const alreadyExists = prev.filter(
          (h) => h.toLowerCase() === city.toLowerCase()
        );
        if (alreadyExists.length > 0) return prev;
        
        return [...prev, city].slice(-5);
      });
    } else {
      setError("City not found. Try again.");
    }

    setLoading(false);
    setCity("");
  };


  const toggleFavorite = (index) => {
    setWeather((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, favorite: !item.favorite } : item
      )
    );
  };


  const removeCity = (index) => {
    setWeather((prev) => prev.filter((_, i) => i !== index));
  };


  const handleNote = (index, text) => {
    setNotes((prev) => ({ ...prev, [index]: text }));
  };


  let filteredData = weather.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

 
  if (filterTemp === "hot") {
    filteredData = filteredData.filter((item) => item.main.temp > 25);
  } else if (filterTemp === "cold") {
    filteredData = filteredData.filter((item) => item.main.temp < 20);
  }


  if (sortType === "az") {
    filteredData = [...filteredData].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortType === "temp") {
    filteredData = [...filteredData].sort(
      (a, b) => b.main.temp - a.main.temp
    );
  }


  const avgTemp =
    weather.length > 0
      ? (
          weather.reduce((sum, item) => sum + item.main.temp, 0) /
          weather.length
        ).toFixed(1)
      : null;

  const hottestCity =
    weather.length > 0
      ? weather.reduce((max, item) =>
          item.main.temp > max.main.temp ? item : max
        )
      : null;

  const coldestCity =
    weather.length > 0
      ? weather.reduce((min, item) =>
          item.main.temp < min.main.temp ? item : min
        )
      : null;


  const appStyle = {
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: darkMode ? "#1a1a2e" : "#f0f4f8",
    color: darkMode ? "#e0e0e0" : "#222",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    border: "1px solid",
    borderColor: darkMode ? "#444" : "#ccc",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "12px",
    backgroundColor: darkMode ? "#16213e" : "#fff",
    textAlign: "left",
  };

  const inputStyle = {
    padding: "8px",
    marginRight: "8px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    backgroundColor: darkMode ? "#2a2a4a" : "#fff",
    color: darkMode ? "#eee" : "#222",
  };

  const btnStyle = {
    padding: "8px 14px",
    marginRight: "8px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4a90e2",
    color: "#fff",
  };

  const statsBoxStyle = {
    border: "1px solid",
    borderColor: darkMode ? "#444" : "#ccc",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "16px",
    backgroundColor: darkMode ? "#0f3460" : "#e8f4fd",
    textAlign: "left",
  };

  return (
    <div style={appStyle}>
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1 style={{ margin: 0 }}>🌦 Weather App</h1>
        <div>
          {/* unit toggle - milestone 4 */}
          <button
            style={{ ...btnStyle, backgroundColor: "#2ecc71" }}
            onClick={() => setUnit(unit === "C" ? "F" : "C")}
          >
            Switch to °{unit === "C" ? "F" : "C"}
          </button>

          
          <button
            style={{ ...btnStyle, backgroundColor: darkMode ? "#555" : "#333" }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      
      <div style={{ marginBottom: "12px" }}>
        <input
          style={inputStyle}
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
        />
        <button style={btnStyle} onClick={getWeather}>
          Add City
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

    
      {history.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: "0 0 6px" }}>
            <b>Recent searches:</b>
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {history.map((h, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  backgroundColor: darkMode ? "#333" : "#ddd",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => setCity(h)}
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

    
      {weather.length > 0 && (
        <div style={statsBoxStyle}>
          <b>📊 Stats Summary ({weather.length} cities):</b>
          <p>
            🌡 Average Temp:{" "}
            {unit === "C" ? `${avgTemp}°C` : `${toF(parseFloat(avgTemp))}°F`}
          </p>
          <p>
            🔥 Hottest: {hottestCity.name} —{" "}
            {showTemp(hottestCity.main.temp)}
          </p>
          <p>
            🧊 Coldest: {coldestCity.name} —{" "}
            {showTemp(coldestCity.main.temp)}
          </p>
        </div>
      )}

      
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "12px",
        }}
      >
        <input
          style={inputStyle}
          type="text"
          placeholder="Search by city name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={inputStyle}
          onChange={(e) => setFilterTemp(e.target.value)}
          value={filterTemp}
        >
          <option value="">Filter: All Temps</option>
          <option value="hot">Hot (&gt;25°C)</option>
          <option value="cold">Cold (&lt;20°C)</option>
        </select>

        <select
          style={inputStyle}
          onChange={(e) => setSortType(e.target.value)}
          value={sortType}
        >
          <option value="">Sort: Default</option>
          <option value="az">Sort: A to Z</option>
          <option value="temp">Sort: Temp High to Low</option>
        </select>
      </div>

      <hr />

      {filteredData.length === 0 && weather.length > 0 && (
        <p>No cities match your filter.</p>
      )}
      {filteredData.length === 0 && weather.length === 0 && (
        <p>Type a city name above and click Add City to get started.</p>
      )}

      
      {filteredData.map((item, index) => {
        const originalIndex = weather.indexOf(item);
        return (
          <div key={index} style={cardStyle}>
          
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <h2 style={{ margin: 0, color: darkMode ? "#fff" : "#111" }}>
                {item.name}, {item.sys.country}
              </h2>
              <div>
                <button
                  style={{
                    ...btnStyle,
                    backgroundColor: item.favorite ? "#e2b74a" : "#aaa",
                    marginRight: "6px",
                  }}
                  onClick={() => toggleFavorite(originalIndex)}
                >
                  {item.favorite ? "⭐ Favorited" : "☆ Favorite"}
                </button>
                <button
                  style={{ ...btnStyle, backgroundColor: "#e25c5c" }}
                  onClick={() => removeCity(originalIndex)}
                >
                  ✕ Remove
                </button>
              </div>
            </div>

            <p>🌡 Temp: {showTemp(item.main.temp)}</p>
            <p>
              🌡 Feels like: {showTemp(item.main.feels_like)}
            </p>
            <p>💧 Humidity: {item.main.humidity}%</p>
            <p>💨 Wind: {item.wind.speed} m/s</p>
            <p>☁️ {item.weather[0].description}</p>

            
            <div style={{ marginTop: "10px" }}>
              <textarea
                placeholder="Add a note for this city..."
                value={notes[originalIndex] || ""}
                onChange={(e) => handleNote(originalIndex, e.target.value)}
                rows={2}
                style={{
                  width: "100%",
                  padding: "6px",
                  borderRadius: "5px",
                  border: "1px solid #aaa",
                  backgroundColor: darkMode ? "#2a2a4a" : "#f9f9f9",
                  color: darkMode ? "#eee" : "#222",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}