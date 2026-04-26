// css imports
import "./App.css";
import "./weather-panel.css";
import "./player.css";

//Libraries imports
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useClock } from "./lib/hooks";
import { ListTodo, Cloud, Settings, Grid2X2, ChevronRight, MapPin, Droplets, CloudRain, X, CloudOff, Wind, Shield, Music } from "lucide-react";
import { SiGoogle, SiDuckduckgo, SiBrave, SiYoutube, SiReddit } from '@icons-pack/react-simple-icons';
// import { Bing, Yandex, StartPage } from "./icons.exports";

// Missing
/*
Bing
yandex
*/

// File imports
import TodoList from "./TodoList";
import AddShortcutPanel from "./AddShortcutPanel";
import ToggleButton from "./ToggleButton";
import { WeatherCard, QuoteCard } from "./Cards";
import Error from "./Error";
import Informer from "./Informer";
import returnMappedWeatherIcon from "./mappedWeatherIcons";


// setInfoContent({
//      primaryInfo: "",
//      secondaryInfo: "debitis possimus voluptas libero sapiente obcaecati illo?",
//      agree: () => {
//           console.log("Agreed")
//      },
//      disagree: () => {
//           setShowInfo(false);
//           console.log("DisAgreed")
//      }
// })

//PENDING :- create a function that would return weather unit types(metric, kelvin) , selected as per user and loads the units on its basis
const SEARCH_OPTIONS = [
     { label: "Google", url: "https://google.com/search?q=", broswerIcon: (<SiGoogle size={20} />) },
     { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=", broswerIcon: (<SiDuckduckgo  size={20}/>) },
     { label: "Brave", url: "https://search.brave.com/search?q=", broswerIcon: (<SiBrave size={20} />) },
     { label: "Bing", url: "https://bing.com/search?q=", broswerIcon: (<SiDuckduckgo size={20} />) },
     { label: "Startpage", url: "https://startpage.com/search?q=", broswerIcon: (<SiDuckduckgo size={20} />) },
     { label: "Yandex", url: "https://yandex.com/search/?text=", broswerIcon: (<SiDuckduckgo size={20} />) },
     { label: "YouTube", url: "https://youtube.com/results?search_query=", broswerIcon: (<SiYoutube size={20} />) },
     { label: "Reddit", url: "https://www.reddit.com/search/?q=", broswerIcon: (<SiReddit size={20} />) }
];
const AI_TOOLS = [
     { name: "Gemini", favicon: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=32", targetURL: "https://gemini.google.com" },
     { name: "Claude", favicon: "https://www.google.com/s2/favicons?domain=claude.ai&sz=32", targetURL: "https://claude.ai" },
     { name: "Meta", favicon: "https://www.google.com/s2/favicons?domain=meta.ai&sz=32", targetURL: "https://www.meta.ai" },
     { name: "ChatGPT", favicon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32", targetURL: "https://chatgpt.com" },
     { name: "Perplexity", favicon: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=32", targetURL: "https://www.perplexity.ai" },
     { name: "Grok", favicon: "https://www.google.com/s2/favicons?domain=grok.com&sz=32", targetURL: "https://grok.com" },
     { name: "Copilot", favicon: "https://www.google.com/s2/favicons?domain=copiot.microsoft.com&sz=32", targetURL: "https://copilot.microsoft.com" },

];
const WEATHER_API_KEYS = [
     "12a250e43dd5527ae82439945006e9aa",
     "ffadeca6e05a14fe995754792ddfca8c",
     "331b02b0aa2db48f067c9d5a49e4e448",
     "fd8df77967e31958674fbe57495db942",
     "32b1c9092ae662b4993b9540bbe1d15f",
     "b40985c9eb1246010a4546aaf127b75a",
     "54fb57ed32f45ae9d99786850e4cdf66",
     "2cc0d78e472fb32792638666faa9caf8",
     "4197131a2e4acabb8b025c9a2b137e99",
     "0599e8d38274b78ffb2420f553a7580a"
];
const DEFAULT_API_KEY = WEATHER_API_KEYS[Math.floor(Math.random() * WEATHER_API_KEYS.length)];

export default function App() {
     const time = useClock();

     // useRef
     const todoRef = useRef(null);
     const playerRef = useRef(null);
     const inputBarRef = useRef(null);
     const typedUserQuery = useRef("");
     const shortcutsRef = useRef(null);
     const isNavigating = useRef(false);
     const activeSuggestionRef = useRef(null);
     const searchSuggestionWrapperRef = useRef(null);

     //useState
     const [query, setQuery] = useState("");
     const [showInfo, setShowInfo] = useState(false);
     const [todoOpen, setTodoOpen] = useState(false);
     const [showError, setShowError] = useState(false);
     const [infoContent, setInfoContent] = useState({});
     const [showPlayer, setShowPlayer] = useState(false);
     const [errorInfo, setShowErrorInfo] = useState({}); // errTitle AND errMessage"
     const [showShortcuts, setShowShortcuts] = useState(false);
     const [isSongPlaying, setIsSongPlaying] = useState(false); //Not in use
     const [showAddShortcut, setShowAddShortcut] = useState(false);
     const [searchSuggestions, setSearchSuggestions] = useState([]);
     const [showWeatherPanel, setShowWeatherPanel] = useState(false);
     const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);
     const [shortcuts, setShortcuts] = useState(() => JSON.parse(localStorage.getItem("shortcuts")) || []);
     const [engine, setEngine] = useState(() => Number.parseInt(localStorage.getItem("selectedEngine") || 0));
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
     function addShortcut(requestedShortcutObj) {
          const { name, url } = requestedShortcutObj;
          const domainName = new URL(url).host; //returns the domain name
          saveShortcuts([...shortcuts, { faviconURL: `https://www.google.com/s2/favicons?domain=${domainName}&sz=32`, name, url }]);
     }
     function doSearch(e) {
          e.preventDefault();
          if (query.trim()) {
               let target = isSongPlaying ? "_blank" : "_self";
               window.open(SEARCH_OPTIONS[engine].url + encodeURIComponent(query), target);
          }
     }
     function updateActiveSuggestion(e) {
          if (e.code === "ArrowDown") {
               e.preventDefault();
               isNavigating.current = true;
               if (activeSuggestionIndex === null) {
                    setActiveSuggestionIndex(0);
                    return;
               }
               else if (activeSuggestionIndex < searchSuggestions.length - 1) {
                    setActiveSuggestionIndex(activeSuggestionIndex + 1)
               }
               else {
                    setActiveSuggestionIndex(0);
               }
               return;
          }
          if (e.code === "ArrowUp") {
               e.preventDefault();
               isNavigating.current = true;
               if (activeSuggestionIndex === null) { return }
               if (activeSuggestionIndex === 0) {
                    setActiveSuggestionIndex(searchSuggestions.length - 1);
               } else {
                    setActiveSuggestionIndex(activeSuggestionIndex - 1);
               }
               return;
          }

          if (e.code === "Enter" && activeSuggestionIndex !== null) {
               e.preventDefault();
               isNavigating.current = true;
               const selectedQuery = searchSuggestions[activeSuggestionIndex];
               setQuery(selectedQuery);
               setSearchSuggestions([]);

               // Search on ENTER
               window.open(SEARCH_OPTIONS[engine].url + encodeURIComponent(selectedQuery), isSongPlaying ? "_blank" : "_self");

          }

     }

     async function fetchSearchSuggestions() {
          try {
               if (SEARCH_OPTIONS[engine].label === "YouTube") {
                    const { data: YTSuggestions } = await axios.get(`/suggest?client=youtube&ds=yt&q=${encodeURIComponent(query)}&callback=func`);
                    const json = YTSuggestions.match(/\((.+)\)/s)[1];
                    const suggestions = JSON.parse(json)[1].map(item => item[0]);
                    setSearchSuggestions(suggestions);

               } else if (SEARCH_OPTIONS[engine].label === "DuckDuckGo") {
                    const { data: suggestions } = await axios.get(`/ddg-suggestions?q=${encodeURIComponent(query)}&type=list`);
                    setSearchSuggestions(suggestions[1]);

               } else if (SEARCH_OPTIONS[engine].label === "Yandex") {
                    const { data: suggestions } = await axios.get(`/yandex-suggestions?part=${encodeURIComponent(query)}`);
                    setSearchSuggestions(suggestions[1]);

               } else {
                    const { data: suggestions } = await axios.get(`/google-suggestions?client=chrome&q=${(query)}`);
                    setSearchSuggestions(suggestions[1]);
               }


          } catch (searchSuggestionError) {
               console.log(searchSuggestionError);
               setSearchSuggestions([]);
               if (searchSuggestionError.status === 502) {
                    // Add a warning information container here , that warns the user about diffrent error
                    // alert("Your internet connection seems to be offline, cannot fetch search suggestions")
                    return;
               }
               throw searchSuggestionError;
          }
          return;
     }
     async function fetchAndStoreWeather(userCoordinatesObj) {
          let { latitude, longitude } = userCoordinatesObj;
          try {
               const { data: fetchedWeather } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${DEFAULT_API_KEY}&units=metric`);
               const { data: fetchedWeatherForecast } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${DEFAULT_API_KEY}&units=metric`);

               const reqWeatherForecast = fetchedWeatherForecast.list.filter(
                    elem => elem.dt_txt.includes("12:00:00")
               );

               // Add coverted values in this object
               const reqWeatherInfo = {
                    locationName: fetchedWeather?.name,
                    country: fetchedWeather?.sys?.country,
                    temperature: {
                         tempInC: Math.round(fetchedWeather?.main.temp),
                    },
                    weatherCode: fetchedWeather?.weather[0].id,
                    wind: {
                         windSpeed: fetchedWeather?.wind.speed,
                         windAngle: fetchedWeather?.wind.deg, // not in use
                    },
                    humidity: {
                         humidity: fetchedWeather?.main.humidity,
                    },
                    rain: {
                         rain: fetchedWeather.rain?.["1h"] || fetchedWeather.snow?.["1h"] || 0, // Can break
                    },
                    fetchTimestamp: Date.now(),
                    sunrise: fetchedWeather?.sys.sunrise,
                    sunset: fetchedWeather?.sys.sunset,
                    fiveDayForecast: reqWeatherForecast
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

     // PURPOSE :- to close the TODO LIST whenever user click outside the todo list(UX improve)
     useEffect(() => {
          if (!todoOpen) return;

          const clickHandler = (event) => {
               // Add a check if user is clicking on todo button , this function should not mark todoOpen as false only then
               if (todoRef.current && !todoRef.current.contains(event.target)) { setTodoOpen(false); }
          }
          document.addEventListener("mousedown", clickHandler);
          return () => document.removeEventListener("mousedown", clickHandler);
     }, [todoOpen]);

     // PURPOSE :- to close the SHORTCUTS TAB div whenever user click outside the shortcuts(UX improve)
     useEffect(() => {
          if (!showShortcuts) return;
          const clickHandler = (event) => {
               if (shortcutsRef.current && !shortcutsRef.current.contains(event.target)) { setShowShortcuts(false); }
          }
          document.addEventListener("mousedown", clickHandler);
          return () => removeEventListener("mousedown", clickHandler);
     }, [showShortcuts]);

     // PURPOSE :- to close the Player div whenever user click outside the shortcuts(UX improve)
     useEffect(() => {
          if (!playerRef) return;
          const clickHandler = (event) => {
               if (playerRef.current && !playerRef.current.contains(event.target)) { setShowPlayer(false) }
          }
          document.addEventListener("mousedown", clickHandler);
          return () => removeEventListener("mousedown", clickHandler);
     }, [showPlayer]);

     // PURPOSE :- to close the SEARCH SUGGESTIONS wrapper whenever user click outside the shortcuts(UX improve)
     useEffect(() => {
          // Start by fixing this
          if (!searchSuggestions.length) return;
          const clickHandler = (event) => {
               if (searchSuggestionWrapperRef.current && !searchSuggestionWrapperRef.current.contains(event.target)) {
                    setSearchSuggestions([]);
                    setActiveSuggestionIndex(null);
               }
          }
          document.addEventListener("mousedown", clickHandler);
          return () => removeEventListener("mousedown", clickHandler);
     }, [searchSuggestions]);

     // PURPOSE :- Provide search suggestions
     useEffect(() => {
          if (!query.length) {
               setSearchSuggestions([]);
               return;
          };
          if (isNavigating.current) {
               isNavigating.current = false;
               return;
          }
          const timer = setTimeout(() => { fetchSearchSuggestions() }, 100);

          return () => clearTimeout(timer);
     }, [query]);

     // PURPOSE :- Auto scroll on suggestion navigation using keyboard arrow keys
     useEffect(() => {
          if (activeSuggestionIndex === null || searchSuggestions[activeSuggestionIndex] === undefined) return;
          setQuery(searchSuggestions[activeSuggestionIndex]);

          if (activeSuggestionRef.current) {
               activeSuggestionRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
               const wrapper = searchSuggestionWrapperRef.current;
               const item = activeSuggestionRef.current;
               if (wrapper && item) {
                    const wrapperBottom = wrapper.scrollTop + wrapper.clientHeight;
                    const wrapperTop = wrapper.scrollTop;
                    const itemBottom = item.offsetTop + item.offsetHeight;
                    const itemTop = item.offsetTop;

                    if (itemBottom > wrapperBottom) {
                         wrapper.scrollTop = itemBottom - wrapper.clientHeight + 10;
                    }
                    if (itemTop < wrapperTop) {
                         wrapper.scrollTop = itemTop - 10;
                    }
               }
          }
     }, [activeSuggestionIndex]);

     useEffect(() => {
          //           // https://www.googleapis.com/youtube/v3/search?part=snippet&q=a&type=audio&maxResults=20&key=AIzaSyDiZH4a_oLZaL71c9NFxD7PfgBArZSr8f4
          //           async function fetchSong() {
          //                const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=ajjubhai&type=video&videoCategoryId=10&videoDuration=short&key=AIzaSyDiZH4a_oLZaL71c9NFxD7PfgBArZSr8f4`)
          //                console.log(data);
          //           }
          //
          //           fetchSong();

     }, []);

     return (
          <>
               <main className="root">
                    <nav className="main-nav alignC">
                         <div className="nav-left alignC">
                              <button className="icon-btn" onClick={() => setTodoOpen(!todoOpen)} title="To-do"><ListTodo strokeWidth="2.5" size={25} color="var(--dark-bg)" /></button>
                         </div>
                         <div className="nav-right alignC">
                              <button
                                   onClick={() => setShowPlayer(true)}
                                   className="icon-btn-rounded center"
                                   title="Player"><Music strokeWidth="3.0" size={25} color="var(--dark-bg)" />
                              </button>
                              <button
                                   onClick={() => setShowWeatherPanel(true)}
                                   className="icon-btn-rounded center"
                                   title="Weather">
                                   {isLocationAllowed ? <Cloud strokeWidth="3.0" size={25} color="var(--dark-bg)" /> : <CloudOff strokeWidth="2.5" size={25} color="var(--dark-bg)" />}

                              </button>
                              {/* Start by :-
                               1. create more button options (song selector, recent searches, google apps, social media apps)
                               2. create a function that, when user press down arrow button , the active search suggestion changes position
                               3. Complete the front UI
                              */}


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
                                             <input
                                                  ref={inputBarRef}
                                                  onKeyDown={(e) => updateActiveSuggestion(e)}
                                                  type="text"
                                                  className="big-search-input"
                                                  placeholder="What are you looking for..."
                                                  value={query}
                                                  onChange={e => {
                                                       setActiveSuggestionIndex(null);
                                                       setQuery(e.target.value);
                                                       typedUserQuery.current = e.target.value;
                                                  }
                                                  } />
                                             <button type="submit" className="big-search-btn"><ChevronRight size={20} /></button>
                                        </div>
                                        <div ref={searchSuggestionWrapperRef} className={`search-suggestions-wrapper ${searchSuggestions.length ? "ssw-active" : ""}`}>
                                             {searchSuggestions.map((suggestion, index) => (
                                                  <button
                                                       ref={index === activeSuggestionIndex ? activeSuggestionRef : null}
                                                       type="button"
                                                       onClick={() => {
                                                            let target = isSongPlaying ? "_blank" : "_self";
                                                            window.open(SEARCH_OPTIONS[engine].url + encodeURIComponent(suggestion), target)
                                                       }}
                                                       key={index}
                                                       className={`search-suggestion-list-item ${index === activeSuggestionIndex ? "search-suggestion-active" : ""
                                                            }`}>
                                                       {suggestion}
                                                  </button>
                                             ))}
                                        </div>
                                   </form>
                                   <div className="engine-tabs">
                                        {SEARCH_OPTIONS.map((eng, i) => (
                                             <button
                                                  key={eng.label}
                                                  style={{gap: "5px"}}
                                                  className={`engine-tab alignC ${engine === i ? "search-opt-btn-active" : ""}`}
                                                  onClick={() => {
                                                       setEngine(i)
                                                       localStorage.setItem("selectedEngine", i);
                                                  }}>
                                                       {eng.broswerIcon}
                                                       {eng.label}
                                             </button>
                                        ))}
                                   </div>
                              </div>
                         </section>

                         {/* Cards */}
                         {/* <QuoteCard />
                         <WeatherCard weatherInfo={weatherInfo}/> */}
                    </div >
                    <footer className="main-footer">
                         <button className="icon-btn footer-btn" title="Settings"><Settings strokeWidth="2.5" size={25} color="var(--dark-bg)" /></button>
                         <div className="ai-tools center">
                              {AI_TOOLS.map((tool, i) => (
                                   <button key={i} onClick={() => window.open(tool.targetURL, isSongPlaying ? "_blank" : "_self")} className="ai-btn center">
                                        <img height={22} width={22} style={{ borderRadius: "100px", flexShrink: "0" }} src={tool.favicon} alt={tool.name} />
                                        {tool.name}
                                   </button>
                              ))}
                         </div>
                         <button className="icon-btn footer-btn" onClick={() => setShowShortcuts(!showShortcuts)} title="Shortcuts"><Grid2X2 strokeWidth="2.5" size={25} color="var(--dark-bg)" /></button>
                    </footer>

                    {
                         showShortcuts && (
                              <div ref={shortcutsRef} className="shortcuts-panel">
                                   <div className="center" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
                                        <div className="shortcut-panel-label" style={{ margin: "0px" }}>Quick Shortcuts</div>
                                        <button onClick={() => setShowAddShortcut(true)} className="add-shortcut-btn">+</button>
                                   </div>
                                   <div className="shortcut-list">
                                        {shortcuts.length ? (
                                             shortcuts.map((s, i) => (
                                                  <div onClick={(e) => {
                                                       if (e.target.classList.contains("remove-shortcut-btn")) return;
                                                       window.open(s.url, isSongPlaying ? "_blank" : "_self")
                                                  }} key={i} className="shortcut-item" style={{ justifyContent: "space-between" }}>
                                                       {/* Can remove this anchor but kept it */}

                                                       {/* Start by loading my own extension into the chrome and generate multiple openweatherapi keys */}

                                                       <a style={{ gap: "8px" }} className="alignC" href={s.url} target={isSongPlaying ? "_blank" : "_self"} title={s.name}>
                                                            <img height={23} width={23} src={s.faviconURL} alt="?" style={{ marginLeft: "3px", borderRadius: "100px" }}></img>
                                                            <span className="shortcut-name">{s.name}</span>
                                                       </a>
                                                       <button onClick={() => removeShortcut(i)} className="remove-shortcut-btn">✕</button>
                                                  </div>
                                             ))
                                        ) : (
                                             <span style={{ display: "block", textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.8)", fontStyle: "italic" }}>No added shortcuts</span>
                                        )}
                                   </div>
                              </div>
                         )
                    }

                    {
                         todoOpen && (
                              <div ref={todoRef} className="todo-panel">
                                   <TodoList />
                              </div>
                         )
                    }

                    {
                         showAddShortcut && (
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
                         )
                    }

                    {
                         showWeatherPanel && (
                              <div className="weather-panel-overlay center" onClick={() => setShowWeatherPanel(false)}>
                                   <div className="weather-panel" onClick={(e) => e.stopPropagation()}>
                                        <div className="weather-panel-head alignC">
                                             <div className="weather-panel-title-wrapper alignC">
                                                  <div className="weather-title-icon center">
                                                       <Cloud strokeWidth="2.5" size={22} />
                                                  </div>
                                                  <span className="weather-panel-title">Weather</span>
                                             </div>
                                             <button
                                                  onClick={() => setShowWeatherPanel(false)}
                                                  className="weather-panel-close center"
                                             >
                                                  <X size={22} />
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
                                                            {weatherInfo?.locationName}, {weatherInfo?.country}
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
                                                                 <span className="temp-unit">&deg;C</span>
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
                                                                      <small>%</small>
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
                                                                      <small>km/h</small>
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
                                                                      <small>mm</small>
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
                         )
                    }

                    {
                         showError && (
                              <Error
                                   onClose={() =>
                                        setShowError(false)
                                   }
                                   errTitle={Object.keys(errorInfo).length ? errorInfo.errTitle : "Network error"}
                                   errMessage={Object.keys(errorInfo).length ? errorInfo.errMessage : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero explicabo sunt ab accusamus? Ad veritatis, quod nesciunt porro et vitae. Quisquam dolor, quo error incidunt ratione natus velit inventore sunt!"} />
                         )
                    }

                    {showInfo && (
                         <Informer
                              onClose={() => setShowInfo(false)}
                              primaryInfo={Object.keys(infoContent).length ? infoContent.primaryInfo : "Random info"}
                              secondaryInfo={Object.keys(infoContent).length ? infoContent.secondaryInfo : "Random secondary info"}
                              actionFunctions={{
                                   "onAgree": infoContent.agree,
                                   "onDisagree": infoContent.disagree
                              }}
                         />
                    )
                    }

                    {showPlayer && (
                         <div
                              ref={playerRef}
                              className={`player-container`}>
                              <span className="player-title">Player</span>
                              <div className="player-search">
                                   <input type="text" placeholder="What was that Song ?" />
                              </div>
                              <div className="player-search-list">
                                   <div style={{ gap: "15px" }} className="player-search-list-item alignC">
                                        <img height={50} width={50} src="/weather_icons/clear-day.png" alt="Loading.." loading="lazy" />
                                        <div className="player-search-details">
                                             <p title="">Building my new castle in netherlands</p>
                                             <p>Techno gamers</p>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}
               </main >
          </>
     );
}
