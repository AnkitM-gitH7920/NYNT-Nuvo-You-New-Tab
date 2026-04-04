// css imports
import "./App.css";
import "./weather-panel.css";

//Libraries imports
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useClock } from "./lib/hooks";
import { ListTodo, Search, Cloud, Settings, Grid2X2, ChevronRight, MapPin, Droplets, CloudRain, X, CloudOff, Wind, Shield } from "lucide-react";

// File imports
import TodoList from "./TodoList";
import AddShortcutPanel from "./AddShortcutPanel";
import ToggleButton from "./ToggleButton";
import { WeatherCard, QuoteCard } from "./Cards";
import Tooltip from "./Tooltip"
import returnMappedWeatherIcon from "./mappedWeatherIcons";

const PALLET_THEMES = {
     // Currently preparing
     "black-gold": {
          "--black-gold-1": "#000000",
          "--black-gold-2": "#14213d",
          "--black-gold-3": "#fca311",
          "--black-gold-4": "#e5e5e5",
          "--black-gold-5": "#ffffff",
     },
     "summer-dream": {
          "--summer-dream-1": "#0081a7",
          "--summer-dream-2": "#00afb9",
          "--summer-dream-3": "#fdfcdc",
          "--summer-dream-4": "#fed9b7",
          "--summer-dream-5": "#f07167",
     },
     "rustic-charm": {
          "--rustic-charm-1": "#fffcf2",
          "--rustic-charm-2": "#ccc5b9",
          "--rustic-charm-3": "#403d39",
          "--rustic-charm-4": "#252422",
          "--rustic-charm-5": "#eb5e28",
     },
     "sweet-summer": {
          "--sweet-summer-1": "#f6bd60",
          "--sweet-summer-2": "#f7ede2",
          "--sweet-summer-3": "#f5cac3",
          "--sweet-summer-4": "#84a59d",
          "--sweet-summer-5": "#f28482",
     },
     "vintage-charm": {
          "--vintage-charm-1": "#04151f",
          "--vintage-charm-2": "#183a37",
          "--vintage-charm-3": "#efd6ac",
          "--vintage-charm-4": "#c44900",
          "--vintage-charm-5": "#432534",
     },
     "limy-green": {
          "--limy-green-1": "#bad7e9",
          "--limy-green-2": "#fef302",
          "--limy-green-3": "#f7fbf3",
          "--limy-green-4": "#a7c658",
          "--limy-green-5": "#16502e",
     },
     "harmony-bliss": {
          "--harmony-bliss-1": "#f4f1de",
          "--harmony-bliss-2": "#e07a5f",
          "--harmony-bliss-3": "#3d405b",
          "--harmony-bliss-4": "#81b29a",
          "--harmony-bliss-5": "#f2cc8f",
     },
     "earthy-tones": {
          "--earthy-tones-1": "#2c6e49",
          "--earthy-tones-2": "#4c956c",
          "--earthy-tones-3": "#fefee3",
          "--earthy-tones-4": "#ffc9b9",
          "--earthy-tones-5": "#d68c45",
     },
     "coastal-vibes": {
          "--coastal-vibes-1": "#2b2d42",
          "--coastal-vibes-2": "#8d99ae",
          "--coastal-vibes-3": "#edf2f4",
          "--coastal-vibes-4": "#ef233c",
          "--coastal-vibes-5": "#d90429",
     },
     "automn-harmony": {
          "--automn-harmony-1": "#3a2e39",
          "--automn-harmony-2": "#1e555c",
          "--automn-harmony-3": "#f4d8cd",
          "--automn-harmony-4": "#edb183",
          "--automn-harmony-5": "#f15152",
     },
     "cozy-cabin": {
          "--cozy-cabin-1": "#550c18",
          "--cozy-cabin-2": "#443730",
          "--cozy-cabin-3": "#786452",
          "--cozy-cabin-4": "#a5907e",
          "--cozy-cabin-5": "#f7dad9",
     },
};
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
     const [isSongPlaying, setIsSongPlaying] = useState(false); //Not in use
     const [showAddShortcut, setShowAddShortcut] = useState(false);
     const [googleSearchQuery, setGoogleSearchQuery] = useState("");
     const [showWeatherPanel, setShowWeatherPanel] = useState(false);
     const [shortcuts, setShortcuts] = useState(() => JSON.parse(localStorage.getItem("shortcuts")) || []);
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
                    fetchedLocationTimeString: (fetchedWeather.current.time).split("T")[1] //Maybe containing bugs, check out
               }
               setWeatherInfo(reqWeatherInfo);
               localStorage.setItem("weatherInfo", JSON.stringify(reqWeatherInfo));

          } catch (weatherFetchError) {
               alert("Seems like something went wrong, please reload the page. If the issue persists, please report the bug to the developer")
               throw weatherFetchError;

          }
     }

     // useEffect
     // PURPOSE :- Manages logic for fetching and storing coordinates and weather
     useEffect(() => {
          if (!isLocationAllowed) {
               setUserCoordinates({});  //CAN CAUSE INFINITE RENDERS
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
                    <nav className="main-nav alignC">
                         <div className="nav-left alignC">
                              <button className="icon-btn" onClick={() => setTodoOpen(!todoOpen)} title="To-do"><ListTodo strokeWidth="2.5" size={25} color="var(--dark-blue)" /></button>
                         </div>
                         <div className="nav-right alignC">
                              {/* <form className="search-wrapper" onSubmit={doSearch}>
                                   <Search size={19} className="search-icon" />
                                   <input onKeyDown={(e) => {
                                        if(e.key === "Enter"){
                                             window.location.href = "https://google.com/search?q="+googleSearchQuery
                                        }
                                   }} placeholder="Search with Google" type="text" className="nav-search" value={googleSearchQuery} onChange={e => setGoogleSearchQuery(e.target.value)} />
                                   <img src="google.png" alt="Google" loading="lazy" height={18} width={18} />
                              </form> */}
                              <button
                                   onClick={() => setShowWeatherPanel(true)}
                                   className="icon-btn"
                                   title="Weather">
                                   {isLocationAllowed ? <Cloud strokeWidth="2.5" size={25} color="var(--dark-blue)" /> : <CloudOff strokeWidth="2.5" size={25} color="var(--dark-blue)" />}

                              </button>
                         </div>
                    </nav>

                    <div className="body-grid">
                         <section className="center-block justifyC">
                              <div className="clock-block flex">
                                   <span className="greeting-text">{greeting}</span>
                                   <div className="time-display">
                                        <span className="time-hm">{hours}<span className="colon">:</span>{minutes}</span>
                                   </div>
                                   <span className="date-text">{dateString}</span>
                              </div>
                              <div className="search-block">
                                   <form className="big-search-form" onSubmit={doSearch}>
                                        <div className="big-search-bar alignC">
                                             <input type="text" className="big-search-input" placeholder="What are you looking for..." value={query} onChange={e => setQuery(e.target.value)} />
                                             <button type="submit" className="big-search-btn"><ChevronRight size={20} /></button>
                                        </div>
                                   </form>
                                   <div className="engine-tabs">
                                        {SEARCH_OPTIONS.map((eng, i) => (<button key={eng.label} className={`engine-tab ${engine === i ? "search-opt-btn-active" : ""}`} onClick={() => setEngine(i)}>{eng.label}</button>))}
                                   </div>
                              </div>
                         </section>

                         {/* Cards */}
                         {/* <QuoteCard />
                         <WeatherCard weatherInfo={weatherInfo}/> */}
                    </div>
                    <footer className="main-footer">
                         <button className="icon-btn footer-btn" title="Settings"><Settings strokeWidth="2.5" size={25} color="var(--dark-blue)" /></button>
                         {/* Mounts the ai tools in the footer */}
                         <div className="ai-tools center">
                              {AI_TOOLS.map((tool, i) => (
                                   <button key={i} onClick={() => window.open(tool.targetURL, isSongPlaying ? "_blank" : "_self")} className="ai-btn center">
                                        <img height={15} width={15} style={{ borderRadius: "100px", flexShrink: "0" }} src={tool.favicon} alt={tool.name} />
                                        {tool.name}
                                   </button>
                              ))}
                         </div>
                         <button className="icon-btn footer-btn" onClick={() => setShowShortcuts(!showShortcuts)} title="Shortcuts"><Grid2X2 strokeWidth="2.5" size={25} color="var(--dark-blue)" /></button>
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
                                        <span style={{ display: "block", textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>No added shortcuts</span>
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
                         <AddShortcutPanel
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
