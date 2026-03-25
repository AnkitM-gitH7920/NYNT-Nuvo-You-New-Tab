import "./App.css";
import "./weather-panel.css";
import axios from "axios";
import returnMappedWeatherIcon from "./mappedWeatherIcons"
import TodoList from "./TodoList";
import AddShortcutPane from "./AddShortcutPane";
import ToggleButton from "./ToggleButton";
import { useState, useEffect } from "react";
import { ListTodo, Search, Cloud, Settings, Grid2X2, ChevronRight, SearchAlert, X, CloudOff, MapPin } from "lucide-react";

const SEARCH_ENGINES = [
     { label: "Google", url: "https://google.com/search?q=" },
     { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
     { label: "Brave", url: "https://search.brave.com/search?q=" },
     { label: "Bing", url: "https://bing.com/search?q=" },
     { label: "Tor Project", url: "https://torproject.org/search?q=" }
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

function useClock() {
     const [time, setTime] = useState(new Date());
     useEffect(() => {
          const t = setInterval(() => setTime(new Date()), 1000);
          return () => clearInterval(t);
     }, []);
     return time;
}

export default function App() {
     const time = useClock();

     const [query, setQuery] = useState("");
     const [engine, setEngine] = useState(0);
     const [todoOpen, setTodoOpen] = useState(false);
     const [showShortcuts, setShowShortcuts] = useState(false);
     const [isSongPlaying, setIsSongPlaying] = useState(false);
     const [showAddShortcut, setShowAddShortcut] = useState(false);
     const [showWeatherPanel, setShowWeatherPanel] = useState(false);
     const [shortcuts, setShortcuts] = useState(() => JSON.parse(localStorage.getItem("shortcuts")) || []);
     const [weatherInfo, setWeatherInfo] = useState(() => JSON.parse(localStorage.getItem("weatherInfo")) || {})
     const [userCoordinates, setUserCoordinates] = useState(() => JSON.parse(localStorage.getItem("user-coords")) || {});
     const [isLocationAllowed, setIsLocationAllowed] = useState(() => localStorage.getItem("isLocationAllowed") === "true");

     // UI useState
     // const [weatherLoading, setWeatherLoading] = useState(false);

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
               window.open(SEARCH_ENGINES[engine].url + encodeURIComponent(query), target);
          }
     }

     async function addShortcut(requestedShortcutObj) {
          const { name, url } = requestedShortcutObj;
          const domainName = new URL(url).host; //returns the domain name
          saveShortcuts([...shortcuts, { faviconURL: `https://www.google.com/s2/favicons?domain=${domainName}&sz=32`, name, url }]);
     }
     async function fetchAndStoreWeather(userCoordinatesObj) {
          const { latitude, longitude } = userCoordinatesObj;

          try {
               console.log("Weather api called")
               const { data: fetchedWeather } = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code`);
               const { data: fetchedGeoCoding } = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);

               console.log(fetchedWeather);
               console.log(fetchedGeoCoding)
               const reqWeatherInfo = {
                    locationName: fetchedGeoCoding.address.state_district,
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
                    fetchTimestamp: Date.now()
               }
               setWeatherInfo(reqWeatherInfo);
               localStorage.setItem("weatherInfo", JSON.stringify(reqWeatherInfo));


          } catch (weatherFetchError) {
               console.log(weatherFetchError);
               alert("Seems like something went wrong, please reload the page. If the issue persists, please report the bug to the developer")
               return;

          }
     }

     // useEffects
     useEffect(() => {
          if (!isLocationAllowed) {
               setUserCoordinates({});
               localStorage.setItem("user-coords", JSON.stringify({}));
               return;
          }

          if (Object.keys(weatherInfo).length === 0 || !weatherInfo) {
               if (Object.keys(userCoordinates).length === 0 || !userCoordinates) {
                    console.log("No coords found, fetching coords and weather...")
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
               } else {
                    console.log("Coords found, fetching weather");
                    fetchAndStoreWeather(userCoordinates)
               }

          } else {
               const isLastFetchWeatherExpired = weatherInfo.fetchTimestamp + 1000 * 60 * 15 < Date.now();
               if (!isLastFetchWeatherExpired) {
                    console.log("Weather data is not expired, not fetching anything")
                    return;
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
                                        {SEARCH_ENGINES.map((eng, i) => (
                                             <button key={eng.label} className={`engine-tab ${engine === i ? "active" : ""}`} onClick={() => setEngine(i)}>{eng.label}</button>
                                        ))}
                                   </div>
                              </div>
                         </section>

                         <section className="right-pane">
                              <div className="right-card right-spotify-card">
                                   <div className="card-label">Now Playing</div>
                                   <div className="spotify-art">♫</div>
                                   <div className="spotify-track">Not connected</div>
                                   <div className="spotify-artist">Connect Spotify to play music</div>
                                   <button className="connect-btn">Connect Spotify</button>
                              </div>
                              <div className="right-card right-weather-card">
                                   <div className="card-label">Weather</div>
                                   <div className="weather-temp">{weatherInfo.length ? weatherInfo.temperature.tempInC : "_"}°</div>
                                   <div className="weather-desc">Allow location access</div>
                              </div>
                              <div className="right-card right-quote-card">
                                   <div className="card-label">Quote</div>
                                   <p className="quote-text">"The only way to do great work is to love what you do."</p>
                                   <span className="quote-author">— Steve Jobs</span>
                              </div>
                         </section>
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
                         <div className="shortcuts-panel">
                              <div className="center" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
                                   <div className="panel-label" style={{ margin: "0px" }}>Quick Shortcuts</div>
                                   <button onClick={() => setShowAddShortcut(true)} className="add-shortcut-btn">+</button>
                              </div>
                              {/* Mounts all shortcuts added */}
                              <div className="shortcut-list">
                                   {shortcuts.length ? (
                                        shortcuts.map((s, i) => (
                                             <div key={i} className="shortcut-item" style={{ justifyContent: "space-between" }}>
                                                  <a style={{ gap: "8px" }} className="alignC" href={s.url} target={isSongPlaying ? "_blank" : "_self"} title={s.name}>
                                                       <img height={19} width={19} src={s.faviconURL} alt={() => (<SearchAlert />)} style={{ marginLeft: "3px", borderRadius: "100px" }}></img>
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
                         <div className="todo-panel">
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

                    {/* <WeatherPane /> */}
                    {showWeatherPanel && (
                         <div className="weather-panel-overlay">
                              <div className="weather-panel">
                                   <div className="weather-panel-head">
                                        <span className="weather-panel-title">Weather</span>
                                        <button onClick={() => setShowWeatherPanel(false)} className="weather-panel-close"><X size={14} /></button>
                                   </div>
                                   <div className="weather-panel-body">
                                        <div style={{
                                             display: "flex",
                                             justifyContent: "space-between",
                                             margin: "10px 0px"

                                        }} className="center">
                                             <span style={{
                                                  fontFamily: "var(--gm-font)",
                                                  fontSize: "0.8rem",
                                                  color: "var(--dim)",
                                                  fontStyle: "italic"
                                             }}>{isLocationAllowed ? "Location access granted" : "No location access"}</span>
                                             <button
                                                  onClick={() => {
                                                       localStorage.setItem("isLocationAllowed", !isLocationAllowed);
                                                       setIsLocationAllowed(!isLocationAllowed);
                                                  }}
                                                  title="Allow location"
                                                  style={{ background: "transparent", border: "none", outline: "none" }}>
                                                  <ToggleButton
                                                       defaultChecked={isLocationAllowed}
                                                       onChange={(checked) => {
                                                            localStorage.setItem("isLocationAllowed", checked);
                                                            setIsLocationAllowed(checked);
                                                       }} />
                                             </button>
                                        </div>
                                   </div>
                                   {Object.keys(weatherInfo).length === 0 ? (
                                        <span style={{
                                             marginTop: "4990px",
                                             color: "var(--dim)",
                                             fontSize: "0.7rem",
                                             fontFamily: "var(--main-font)",

                                        }}>Please allow location first</span>
                                   ) : (
                                        <div className="weather-loaded-info">
                                             <span style={{ margin: "10px 0px", gap: "5px" }} className="loc-name alignC">
                                                  <MapPin height={19} />
                                                  {weatherInfo.locationName}
                                             </span>
                                             <div style={{ gap: "2rem", margin: "20px 0px" }} className="weather-icon-temp alignC">
                                                  <img height={80} width={80} src={returnMappedWeatherIcon(weatherInfo.weatherCode).wmoIconUrl} alt="Loading..." loading="lazy" />
                                                  <div style={{ marginTop: "10px", display: "flex", alignContent: "flex-start", flexDirection: "column" }} className="temp-humidity">
                                                       <span
                                                            style={{
                                                                 fontSize: "2.9rem",
                                                                 fontWeight: "600",
                                                                 lineHeight: "55px"
                                                            }}>
                                                            {weatherInfo.temperature.tempInC} {weatherInfo.temperature.tempUnit}
                                                       </span>
                                                       <span style={{
                                                            fontFamily: "var(--gm-font)",
                                                            color: "var(--dim)",
                                                            fontSize: "0.85rem",
                                                            letterSpacing: "1px"
                                                       }}>{returnMappedWeatherIcon(weatherInfo.weatherCode).main}</span>
                                                  </div>
                                             </div>
                                             <div style={{ gap: "10px", marginTop: "25px" }} className="alignC">
                                                  <div className="humidity-card center alignC">
                                                       <img height={30} width={30} loading="lazy" src="/weather_icons/humidity.svg" alt="Humidity..." />
                                                       <span className="weather-panel-card-value">{weatherInfo.humidity.humidity}{weatherInfo.humidity.humidityUnit}</span>
                                                       <span className="weather-panel-card-titles">Humidity</span>
                                                  </div>
                                                  <div className="wind-card center alignC">
                                                       <img height={30} width={30} loading="lazy" src="/weather_icons/wind.svg" alt="Wind..." />
                                                       <span className="weather-panel-card-value">{weatherInfo.wind.windSpeed}{weatherInfo.wind.windSpeedUnit}</span>
                                                       <span className="weather-panel-card-titles">Wind</span>
                                                  </div>
                                                  <div className="precipitation-card center alignC">
                                                       <img height={30} width={30} loading="lazy" src="/weather_icons/precipitation.svg" alt="Precipitation..." />
                                                       <span className="weather-panel-card-value">{weatherInfo.rain.rain}{weatherInfo.rain.rainUnit}</span>
                                                       <span className="weather-panel-card-titles">Rain</span>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </div >
                    )}
               </main>
          </>
     );
}
