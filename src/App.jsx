import "./App.css";
import "./weather-panel.css";
import "./weather-card.css";
import axios from "axios";
import returnMappedWeatherIcon from "./mappedWeatherIcons"
import TodoList from "./TodoList";
import AddShortcutPane from "./AddShortcutPane";
import ToggleButton from "./ToggleButton";
import { useState, useEffect, useRef } from "react";
import { useClock } from "./lib/hooks";
import { ListTodo, Search, Cloud, Settings, Grid2X2, ChevronRight, SearchAlert, X, CloudOff, MapPin, Droplets, Wind, CloudRain, Shield } from "lucide-react";

const SEARCH_OPTIONS = [
     { label: "Google", url: "https://google.com/search?q=" },
     { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
     { label: "Brave", url: "https://search.brave.com/search?q=" },
     { label: "Bing", url: "https://bing.com/search?q=" },
     { label: "Startpage", url: "https://startpage.com/search?q=" },
     { label: "Yandex", url: "https://yandex.com/search/?text=" },
     { label: "YouTube", url: "https://youtube.com/results?search_query=" },
     { label: "Reddit", url: "https://www.reddit.com/search/?q=" }
];
const AI_TOOLS = [
     { name: "Gemini", favicon: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=32", targetURL: "https://gemini.google.com" },
     { name: "Claude", favicon: "https://www.google.com/s2/favicons?domain=claude.ai&sz=32", targetURL: "https://claude.ai" },
     { name: "Meta", favicon: "https://www.google.com/s2/favicons?domain=meta.ai&sz=32", targetURL: "https://www.meta.ai" },
     { name: "ChatGPT", favicon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32", targetURL: "https://chatgpt.com" },
     { name: "Perplexity", favicon: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=32", targetURL: "https://www.perplexity.ai" },
     { name: "Grok", favicon: "https://www.google.com/s2/favicons?domain=grok.com&sz=32", targetURL: "https://grok.com" },
     { name: "Copilot", favicon: "https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=32", targetURL: "https://copilot.microsoft.com" },

];

export default function App() {
     const time = useClock();

     // useRef
     const todoRef = useRef(null);
     const shortcutsRef = useRef(null);

     //useState
     const [query, setQuery] = useState("");
     const [engine, setEngine] = useState(0);
     const [todoOpen, setTodoOpen] = useState(false);
     const [showShortcuts, setShowShortcuts] = useState(false);
     const [isSongPlaying, setIsSongPlaying] = useState(false);
     const [showAddShortcut, setShowAddShortcut] = useState(false);
     const [showWeatherPanel, setShowWeatherPanel] = useState(false);
     const [quotes, setQuotes] = useState(() => JSON.parse(localStorage.getItem("quotes") || "[]"));
     const [shortcuts, setShortcuts] = useState(() => JSON.parse(localStorage.getItem("shortcuts")) || []);
     const [todayQuote, setTodayQuote] = useState(() => JSON.parse(localStorage.getItem("todayQuote")) || {});
     const [weatherInfo, setWeatherInfo] = useState(() => JSON.parse(localStorage.getItem("weatherInfo")) || {})
     const [userCoordinates, setUserCoordinates] = useState(() => JSON.parse(localStorage.getItem("user-coords")) || {});
     const [isLocationAllowed, setIsLocationAllowed] = useState(() => localStorage.getItem("isLocationAllowed") === "true");

     const hours = String(time.getHours()).padStart(2, "0");
     const minutes = String(time.getMinutes()).padStart(2, "0");
     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     const dateString = `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}`;
     const greeting = time.getHours() < 12 ? "Good morning" : time.getHours() < 17 ? "Good afternoon" : "Good evening";

     function saveShortcuts(arr) { setShortcuts(arr); localStorage.setItem("shortcuts", JSON.stringify(arr)); }
     function removeShortcut(i) { saveShortcuts(shortcuts.filter((_, j) => j !== i)); }
     function doSearch(e) {
          e.preventDefault();
          if (query.trim()) {
               let target = isSongPlaying ? "_blank" : "_self";
               window.open(SEARCH_OPTIONS[engine].url + encodeURIComponent(query), target);
          }
     }

     async function addShortcut(requestedShortcutObj) {
          const { name, url } = requestedShortcutObj;
          const domainName = new URL(url).host; //returns the domain name
          saveShortcuts([...shortcuts, { faviconURL: `https://www.google.com/s2/favicons?domain=${domainName}&sz=32`, name, url }]);
     }
     async function fetchAndStoreWeather(userCoordinatesObj) {
          let { latitude, longitude } = userCoordinatesObj;

          try {
               const { data: fetchedWeather } = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code`);
               const { data: fetchedGeoCoding } = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);


               console.log(fetchedWeather);
               console.log(fetchedGeoCoding)
               const reqWeatherInfo = {
                    locationName:
                         fetchedGeoCoding.address.state_district ||
                         fetchedGeoCoding.address.town ||
                         fetchedGeoCoding.address.county ||
                         fetchedGeoCoding.address.region,
                    address: fetchedGeoCoding.display_name,
                    temperature: {
                         tempInC: Math.round(fetchedWeather?.current.temperature_2m),
                         tempUnit: fetchedWeather.current_units.temperature_2m
                    },
                    wind: {
                         windSpeed: fetchedWeather?.current.wind_speed_10m,
                         windAngle: fetchedWeather?.current.wind_direction_10m,
                         windSpeedUnit: fetchedWeather?.current_units.wind_speed_10m,
                         windAngleUnit: fetchedWeather?.current_units.wind_direction_10m
                    },
                    humidity: {
                         humidity: fetchedWeather?.current.relative_humidity_2m,
                         humidityUnit: fetchedWeather?.current_units.relative_humidity_2m
                    },
                    rain: {
                         rain: fetchedWeather?.current.precipitation,
                         rainUnit: fetchedWeather?.current_units.precipitation,
                    },
                    weatherCode: fetchedWeather?.current.weather_code,
                    fetchTimestamp: Date.now(),
                    fetchedLocationTimeString: (fetchedWeather.current.time).split("T")[1]
               }
               setWeatherInfo(reqWeatherInfo);
               localStorage.setItem("weatherInfo", JSON.stringify(reqWeatherInfo));

          } catch (weatherFetchError) {
               alert("Seems like something went wrong, please reload the page. If the issue persists, please report the bug to the developer")
               throw weatherFetchError;

          }
     }

     // useEffect
     // PURPOSE :- Check if LS have stored quotes, if not read from /src/quotes.json
     useEffect(() => {
          const controller = new AbortController();
          if (quotes.length) { return } else {
               axios.get("/src/quotes.json").then((quotes) => {
                    localStorage.setItem("quotes", JSON.stringify(quotes.data));
                    setQuotes(quotes.data);
               }).catch((err) => {
                    if (err.name !== 'AbortError') { throw err }
                    localStorage.setItem("quotes", JSON.stringify([]));
                    setQuotes([]);
                    return;
               });
          }
          return () => controller.abort();
     }, [quotes]);

     // PURPOSE :- Manages logic for fetching and storing coordinates and weather
     useEffect(() => {
          if (!isLocationAllowed) {
               setUserCoordinates({});
               localStorage.setItem("user-coords", JSON.stringify({}));
               if (!isLocationAllowed && weatherInfo.fetchTimestamp + 1000 * 60 * 10 < Date.now()) {
                    setWeatherInfo({});
                    localStorage.setItem("weatherInfo", JSON.stringify({}));
                    return;
               }
               return;
          }
          if (Object.keys(weatherInfo).length === 0 || !weatherInfo) {
               if (Object.keys(userCoordinates).length === 0 || !userCoordinates) {
                    navigator.geolocation.getCurrentPosition(
                         async (position) => {
                              const { latitude, longitude } = position.coords;
                              if (!latitude || !longitude) return;
                              setUserCoordinates({ latitude, longitude });
                              localStorage.setItem("user-coords", JSON.stringify({ latitude, longitude }));

                              fetchAndStoreWeather({ latitude, longitude });

                         }, (error) => {
                              if (error.code === 1) {
                                   setIsLocationAllowed(false);
                                   localStorage.setItem("isLocationAllowed", false);
                                   setUserCoordinates({})
                                   localStorage.setItem("user-coords", JSON.stringify({}))
                                   throw new Error("User denied location access")
                              }
                         }
                    )
                    return;
               } else { fetchAndStoreWeather(userCoordinates) }

          } else {
               const isLastFetchWeatherExpired = weatherInfo.fetchTimestamp + 1000 * 60 * 10 < Date.now();
               if (!isLastFetchWeatherExpired) {
                    return
               } else {
                    navigator.geolocation.getCurrentPosition(
                         async (position) => {
                              const { longitude, latitude } = position.coords;
                              fetchAndStoreWeather({ longitude, latitude })
                         }, (error) => {
                              if (error.code === 1) alert("Please allow this page to acces GPS location");
                              return;
                         }, { enableHighAccuracy: true }
                    )
               }
          }
     }, [isLocationAllowed]);

     // PURPOSE :- to close the div whenever user click outside the todo list(UX improve)
     useEffect(() => {
          if (!todoOpen) return;

          const clickHandler = (event) => {
               if (todoRef.current && !todoRef.current.contains(event.target)) { setTodoOpen(false); }
          }
          document.addEventListener("mousedown", clickHandler);
          return () => removeEventListener("mousedown", clickHandler);
     }, [todoOpen])

     // PURPOSE :- to close the div whenever user click outside the shortcuts(UX improve)
     useEffect(() => {
          if (!showShortcuts) return;

          const clickHandler = (event) => {
               if (shortcutsRef.current && !shortcutsRef.current.contains(event.target)) { setShowShortcuts(false); }
          }
          document.addEventListener("mousedown", clickHandler);
          return () => removeEventListener("mousedown", clickHandler);
     }, [showShortcuts])

     return (
          <>
               <main className="root">
                    <nav className="main-nav">
                         <div className="nav-left">
                              <button className="icon-btn" onClick={() => setTodoOpen(!todoOpen)} title="To-do"><ListTodo size={19} color="var(--text)" /></button>
                         </div>
                         <div className="nav-right">
                              <form className="search-wrapper" onSubmit={doSearch}>
                                   <Search size={19} className="search-icon" />
                                   <input placeholder="Search with Google" type="text" className="nav-search" value={query} onChange={e => setQuery(e.target.value)} />
                                   <img src="google.png" alt="Google" loading="lazy" height={18} width={18} />
                              </form>
                              <button className="icon-btn" title="Spotify"><img src="spotify.svg" alt="Spotify" width={22} height={22} style={{ filter: "contrast(0.8)" }} /></button>
                              <button
                                   onClick={() => setShowWeatherPanel(true)}
                                   className="icon-btn"
                                   title="Weather">
                                   {isLocationAllowed ? <Cloud size={19} color="var(--text)" /> : <CloudOff size={19} color="var(--dim)" />}

                              </button>
                         </div>
                    </nav>

                    <div className="body-grid">
                         <section className="left-pane">
                              <div className="clock-block">
                                   <span className="greeting-text">{greeting}</span>
                                   <div className="time-display">
                                        <span className="time-hm">{hours}<span className="colon">:</span>{minutes}</span>
                                   </div>
                                   <span className="date-text">{dateString}</span>
                              </div>
                              <div className="search-block">
                                   <form className="big-search-form" onSubmit={doSearch}>
                                        <div className="big-search-bar">
                                             <input type="text" className="big-search-input" placeholder="What are you looking for..." value={query} onChange={e => setQuery(e.target.value)} />
                                             <button type="submit" className="big-search-btn"><ChevronRight size={20} /></button>
                                        </div>
                                   </form>
                                   <div className="engine-tabs">
                                        {SEARCH_OPTIONS.map((eng, i) => (
                                             <button key={eng.label} className={`engine-tab ${engine === i ? "active" : ""}`} onClick={() => setEngine(i)}>{eng.label}</button>
                                        ))}
                                   </div>
                              </div>
                         </section>
                         <div className="right-pane">
                              <div className="right-card right-quote-card">
                                   <div className="card-label">Quote</div>
                                   <p className="quote-text">"The only way to do great work is to love what you do."</p>
                                   <span className="quote-author">— Steve Jobs</span>
                              </div>
                              <div className="home-weather-card">
                                   <div className="hwc-header">
                                        <span className="hwc-label">Weather</span>
                                        {Object.keys(weatherInfo).length > 0 && (
                                             <div className="hwc-location">
                                                  <MapPin size={10} />
                                                  <span className="hwc-location-name">{weatherInfo.locationName ? weatherInfo.locationName : weatherInfo.address}</span>
                                             </div>
                                        )}
                                   </div>
                                   {Object.keys(weatherInfo).length === 0 ? (
                                        <div className="hwc-empty">
                                             <CloudOff size={28} />
                                             <span className="hwc-empty-title">No Weather Data</span>
                                             <span className="hwc-empty-desc">Enable location access from the weather panel</span>
                                        </div>
                                   ) : (
                                        <>
                                             <div className="hwc-main">
                                                  <div className="hwc-icon-wrap">
                                                       <img
                                                            src={returnMappedWeatherIcon(weatherInfo.weatherCode).wmoIconUrl}
                                                            alt="Weather"
                                                            loading="lazy"
                                                       />
                                                       <div className="hwc-icon-glow"></div>
                                                  </div>
                                                  <div className="hwc-temp-block">
                                                       <div className="hwc-temp-row">
                                                            <span className="hwc-temp-number">{weatherInfo.temperature.tempInC}</span>
                                                            <span className="hwc-temp-unit">{weatherInfo.temperature.tempUnit}</span>
                                                       </div>
                                                       <span style={{
                                                            width: "fit-content",
                                                            fontFamily: "var(--gm-font)",
                                                            fontSize: "0.75rem",
                                                            color: "var(--dim)",
                                                            margin: "5px 0px",
                                                            fontWeight: "500"
                                                       }} className="hwc-condition">{returnMappedWeatherIcon(weatherInfo.weatherCode).main}</span>
                                                  </div>
                                             </div>

                                             <div className="hwc-stats">
                                                  <div className="hwc-stat humidity">
                                                       <div className="hwc-stat-icon"><Droplets size={13} /></div>
                                                       <span className="hwc-stat-label">Humidity</span>
                                                       <span className="hwc-stat-value">{weatherInfo.humidity.humidity}<small>{weatherInfo.humidity.humidityUnit}</small></span>
                                                  </div>
                                                  <div className="hwc-stat rain">
                                                       <div className="hwc-stat-icon"><CloudRain size={13} /></div>
                                                       <span className="hwc-stat-label">Rain</span>
                                                       <span className="hwc-stat-value">{weatherInfo.rain.rain}<small>{weatherInfo.rain.rainUnit}</small></span>
                                                  </div>
                                             </div>
                                        </>
                                   )}
                              </div>
                              <div className="right-card right-spotify-card">
                                   <div className="card-label">Now Playing</div>
                                   <div className="spotify-art">♫</div>
                                   <div className="spotify-track">Not connected</div>
                                   <div className="spotify-artist">Connect Spotify to play music</div>
                                   <button className="connect-btn">Connect Spotify</button>
                              </div>
                         </div>
                    </div>
                    <footer className="main-footer">
                         <button className="icon-btn footer-btn" title="Settings"><Settings size={19} color="var(--text)" /><span className="footer-label">Settings</span></button>
                         {/* Mounts the ai tools in the footer */}
                         <div className="ai-tools center">
                              {AI_TOOLS.map((tool, i) => (
                                   <button key={i} onClick={() => window.open(tool.targetURL, isSongPlaying ? "_blank" : "_self")} className="ai-btn center">
                                        <img height={15} width={15} style={{ borderRadius: "100px", flexShrink: "0" }} src={tool.favicon} alt={tool.name} />
                                        {tool.name}
                                   </button>
                              ))}
                         </div>
                         <button className="icon-btn footer-btn" onClick={() => setShowShortcuts(!showShortcuts)} title="Shortcuts"><Grid2X2 size={19} color="var(--text)" /><span className="footer-label">Shortcuts</span></button>
                    </footer>

                    {showShortcuts && (
                         <div ref={shortcutsRef} className="shortcuts-panel">
                              <div className="center" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
                                   <div className="panel-label" style={{ margin: "0px" }}>Quick Shortcuts</div>
                                   <button onClick={() => setShowAddShortcut(true)} className="add-shortcut-btn">+</button>
                              </div>
                              <div className="shortcut-list">
                                   {shortcuts.length ? (
                                        shortcuts.map((s, i) => (
                                             <div key={i} className="shortcut-item" style={{ justifyContent: "space-between" }}>
                                                  <a style={{ gap: "8px" }} className="alignC" href={s.url} target={isSongPlaying ? "_blank" : "_self"} title={s.name}>
                                                       <img height={19} width={19} src={s.faviconURL} alt="?" style={{ marginLeft: "3px", borderRadius: "100px" }}></img>
                                                       <span className="shortcut-name">{s.name}</span>
                                                  </a>
                                                  <button onClick={() => removeShortcut(i)} className="remove-shortcut-btn">✕</button>
                                             </div>
                                        ))
                                   ) : (
                                        <div style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>No added shortcuts</div>
                                   )}
                              </div>
                         </div>
                    )}

                    {todoOpen && (
                         <div ref={todoRef} className="todo-panel">
                              <div className="panel-label">Tasks</div>
                              <TodoList />
                         </div>
                    )}

                    {showAddShortcut && (
                         <AddShortcutPane
                              onClose={() => {
                                   setShowAddShortcut(false);
                                   setShowShortcuts(false);
                              }}
                              onAdd={(requestedShortcutObj) => {
                                   if (!requestedShortcutObj.name && !requestedShortcutObj.url) return;
                                   addShortcut(requestedShortcutObj)
                                   setShowAddShortcut(false);
                              }}
                         />
                    )}

                    {showWeatherPanel && (
                         <div className="weather-panel-overlay center" onClick={() => setShowWeatherPanel(false)}>
                              <div className="weather-panel" onClick={(e) => e.stopPropagation()}>
                                   <div className="weather-panel-head alignC">
                                        <div className="weather-panel-title-wrapper alignC">
                                             <div className="weather-title-icon center">
                                                  <Cloud size={16} />
                                             </div>
                                             <span className="weather-panel-title">Weather</span>
                                        </div>
                                        <button
                                             onClick={() => setShowWeatherPanel(false)}
                                             className="weather-panel-close center"
                                        >
                                             <X size={14} />
                                        </button>
                                   </div>
                                   <div className="weather-permission-card alignC">
                                        <div className="permission-info flex">
                                             <div className={`permission-status alignC ${isLocationAllowed ? 'active' : ''}`}>
                                                  <div className="status-dot"></div>
                                                  <span>{isLocationAllowed ? "Location enabled" : "Location disabled"}</span>
                                             </div>
                                             <p className="permission-desc">
                                                  {isLocationAllowed
                                                       ? "Fetching weather for your area"
                                                       : "Enable to see local weather"
                                                  }
                                             </p>
                                        </div>
                                        <ToggleButton
                                             defaultChecked={isLocationAllowed}
                                             onChange={(checked) => {
                                                  localStorage.setItem("isLocationAllowed", checked);
                                                  setIsLocationAllowed(checked);
                                                  setTimeout(() => { window.location.reload() }, 300);
                                             }}
                                        />
                                   </div>
                                   {Object.keys(weatherInfo).length === 0 ? (
                                        <div className="weather-empty-state center">
                                             <div className="empty-icon center"><CloudOff size={32} /> </div>
                                             <span className="empty-title">No Weather Data</span>
                                             <span className="empty-desc">Enable location access to see current weather conditions</span>
                                        </div>
                                   ) : (
                                        <div className="weather-content">
                                             <div className="weather-location center">
                                                  <MapPin className="location-pin" size={14} />
                                                  <span>
                                                       {weatherInfo.locationName ? weatherInfo.locationName : weatherInfo.address}
                                                  </span>
                                             </div>
                                             <div className="weather-main-display center">
                                                  <div className="weather-icon-wrapper center">
                                                       <img
                                                            src={returnMappedWeatherIcon(weatherInfo.weatherCode).wmoIconUrl}
                                                            alt="Weather"
                                                            loading="lazy"
                                                       />
                                                       <div className="icon-glow"></div>
                                                  </div>
                                                  <div className="weather-temp-info flex">
                                                       <div className="temp-value flex">
                                                            <span className="temp-number">{weatherInfo.temperature.tempInC}</span>
                                                            <span className="temp-unit">{weatherInfo.temperature.tempUnit}</span>
                                                       </div>
                                                       <span className="weather-condition">
                                                            {returnMappedWeatherIcon(weatherInfo.weatherCode).main}
                                                       </span>
                                                  </div>
                                             </div>
                                             <div className="weather-stats-grid">
                                                  <div className="weather-stat-card humidity">
                                                       <div className="stat-icon-wrapper">
                                                            <Droplets size={20} />
                                                       </div>
                                                       <div className="stat-details">
                                                            <span className="stat-value">
                                                                 {weatherInfo.humidity.humidity}
                                                                 <small>{weatherInfo.humidity.humidityUnit}</small>
                                                            </span>
                                                            <span className="stat-label">Humidity</span>
                                                       </div>
                                                  </div>

                                                  <div className="weather-stat-card wind">
                                                       <div className="stat-icon-wrapper">
                                                            <Wind size={20} />
                                                       </div>
                                                       <div className="stat-details">
                                                            <span className="stat-value">
                                                                 {weatherInfo.wind.windSpeed}
                                                                 <small>{weatherInfo.wind.windSpeedUnit}</small>
                                                            </span>
                                                            <span className="stat-label">Wind Speed</span>
                                                       </div>
                                                  </div>

                                                  <div className="weather-stat-card rain">
                                                       <div className="stat-icon-wrapper">
                                                            <CloudRain size={20} />
                                                       </div>
                                                       <div className="stat-details">
                                                            <span className="stat-value">
                                                                 {weatherInfo.rain.rain}
                                                                 <small>{weatherInfo.rain.rainUnit}</small>
                                                            </span>
                                                            <span className="stat-label">Rain</span>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div className="weather-privacy-notice">
                                                  <Shield size={23} />
                                                  <span>Your location data stays private and is only used for weather</span>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}
               </main>
          </>
     );
}
