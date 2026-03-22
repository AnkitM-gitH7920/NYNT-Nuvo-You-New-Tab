
import { useEffect, useState } from "react";
import { X, MapPin, Wind, Droplets, Eye, Thermometer } from "lucide-react";

const WEATHER_CODES = {
     0: { label: "Clear sky", icon: "☀️" },
     1: { label: "Mostly clear", icon: "🌤️" },
     2: { label: "Partly cloudy", icon: "⛅" },
     3: { label: "Overcast", icon: "☁️" },
     45: { label: "Foggy", icon: "🌫️" },
     48: { label: "Icy fog", icon: "🌫️" },
     51: { label: "Light drizzle", icon: "🌦️" },
     61: { label: "Rainy", icon: "🌧️" },
     71: { label: "Snowy", icon: "❄️" },
     80: { label: "Showers", icon: "🌧️" },
     95: { label: "Thunderstorm", icon: "⛈️" },
};

export default function WeatherPanel({ onClose }) {
     const [weather, setWeather] = useState(null);
     const [city, setCity] = useState("");
     const [error, setError] = useState("");
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          navigator.geolocation.getCurrentPosition(
               async (pos) => {
                    try {
                         const { latitude: lat, longitude: lon } = pos.coords;

                         const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,windspeed_10m,visibility`);
                         const wData = await wRes.json();

                         const gRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                         const gData = await gRes.json();

                         setWeather(wData.current_weather);
                         setCity(gData.address?.city || gData.address?.town || gData.address?.village || "Your location");
                    } catch {
                         setError("Failed to fetch weather.");
                    } finally {
                         setLoading(false);
                    }
               },
               () => { setError("Location access denied."); setLoading(false); }
          );
     }, []);

     const code = weather?.weathercode;
     const meta = WEATHER_CODES[code] || { label: "Unknown", icon: "🌡️" };

     return (
          <div className="weather-panel-overlay" onClick={onClose}>
               <div className="weather-panel" onClick={e => e.stopPropagation()}>

                    <div className="weather-panel-head">
                         <span className="weather-panel-title">Weather</span>
                         <button className="weather-panel-close" onClick={onClose}><X size={15} /></button>
                    </div>

                    {loading && <div className="weather-panel-loading">Fetching weather...</div>}
                    {error && <div className="weather-panel-error">{error}</div>}

                    {weather && !loading && (
                         <>
                              <div className="weather-main">
                                   <span className="weather-big-icon">{meta.icon}</span>
                                   <div>
                                        <div className="weather-big-temp">{Math.round(weather.temperature)}°C</div>
                                        <div className="weather-big-label">{meta.label}</div>
                                   </div>
                              </div>

                              <div className="weather-location">
                                   <MapPin size={12} />
                                   <span>{city}</span>
                              </div>

                              <div className="weather-stats">
                                   <div className="weather-stat">
                                        <Wind size={13} />
                                        <span>{weather.windspeed} km/h</span>
                                        <span className="weather-stat-label">Wind</span>
                                   </div>
                                   <div className="weather-stat">
                                        <Thermometer size={13} />
                                        <span>{weather.temperature}°</span>
                                        <span className="weather-stat-label">Feels like</span>
                                   </div>
                              </div>
                         </>
                    )}
               </div>
          </div>
     );
}
