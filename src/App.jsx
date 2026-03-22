import "./App.css";
import TodoList from "./TodoList";
import { useState, useEffect } from "react";
import { ListTodo, Search, Cloud, Settings, Grid2X2, ChevronRight } from "lucide-react";
// import axios from "axios";

// const default_icon_color = ""
const SEARCH_ENGINES = [
     { label: "Google", url: "https://google.com/search?q=", short: "G" },
     { label: "DuckDuckGo", url: "https://duckduckgo.com/?q=", short: "D" },
     { label: "Brave", url: "https://search.brave.com/search?q=", short: "B" },
     { label: "Bing", url: "https://bing.com/search?q=", short: "Bi" },
     { label: "Tor Project", url: "https://torproject.org/search?q=", short: "T" }
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
     const [shortcuts, setShortcuts] = useState([
          { name: "YouTube", url: "https://youtube.com", faviconURL: "▶" }
     ]);
     const [temprature, setTemperature] = useState("");

     const hours = String(time.getHours()).padStart(2, "0");
     const minutes = String(time.getMinutes()).padStart(2, "0");
     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

     const dateString = `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}`;

     const greeting = time.getHours() < 12 ? "Good morning" : time.getHours() < 17 ? "Good afternoon" : "Good evening";

     function doSearch(e) {
          e.preventDefault();
          if (query.trim()) {
               //
               window.open(SEARCH_ENGINES[engine].url + encodeURIComponent(query), "_self")
          }
     }

     return (
          <>
               <main className="root">

                    {/* Main Navbar */}
                    <nav className="main-nav">
                         <div className="nav-left">
                              <button className="icon-btn" onClick={() => setTodoOpen(!todoOpen)} title="To-do">
                                   <ListTodo size={19} />
                              </button>
                         </div>
                         <div className="nav-right">
                              <form className="search-wrapper" onSubmit={doSearch}>
                                   <Search size={19} className="search-icon" />
                                   <input
                                        placeholder="Search with Google"
                                        type="text"
                                        className="nav-search"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                   />
                                   <img src="google.png" alt="Google" loading="lazy" height={18} width={18} />
                              </form>
                              <button className="icon-btn" title="Spotify">
                                   <img src="spotify.svg" alt="Spotify" width={22} height={22} style={{ filter: "contrast(0.8)" }} />
                              </button>
                              <button className="icon-btn" title="Weather">
                                   <Cloud size={19} />
                              </button>
                         </div>
                    </nav>

                    {/* Main Body */}
                    <div className="body-grid">

                         {/* Main body left */}
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
                                             <input
                                                  type="text"
                                                  className="big-search-input"
                                                  placeholder="What are you looking for..."
                                                  value={query}
                                                  onChange={e => setQuery(e.target.value)}
                                             />
                                             <button type="submit" className="big-search-btn">
                                                  <ChevronRight size={20} />
                                             </button>
                                        </div>
                                   </form>

                                   <div className="engine-tabs">
                                        {SEARCH_ENGINES.map((eng, i) => (
                                             <button
                                                  key={eng.label}
                                                  className={`engine-tab ${engine === i ? "active" : ""}`}
                                                  onClick={() => setEngine(i)}
                                             >
                                                  {eng.label}
                                             </button>
                                        ))}
                                   </div>
                              </div>
                         </section>

                         {/* main body right */}
                         <section className="right-pane">
                              <div className="right-card spotify-card">
                                   <div className="card-label">Now Playing</div>
                                   <div className="spotify-art">♫</div>
                                   <div className="spotify-track">Not connected</div>
                                   <div className="spotify-artist">Connect Spotify to play music</div>
                                   <button className="connect-btn">Connect Spotify</button>
                              </div>

                              <div className="right-card weather-card">
                                   <div className="card-label">Weather</div>
                                   <div className="weather-temp">{temprature.length ? temprature : "_"}°</div>
                                   <div className="weather-desc">Allow location access</div>
                              </div>

                              <div className="right-card quote-card">
                                   <div className="card-label">Quote</div>
                                   <p className="quote-text">"The only way to do great work is to love what you do."</p>
                                   <span className="quote-author">— Steve Jobs</span>
                              </div>
                         </section>
                    </div>

                    {/* Main body footer */}
                    <footer className="main-footer">
                         <button className="icon-btn footer-btn settings-btn" title="Settings">
                              <Settings size={19} />
                              <span className="footer-label">Settings</span>
                         </button>
                         <div className="ai-tools center">
                              {AI_TOOLS.map((tool, index) => (
                                   <button
                                        key={index}
                                        onClick={() => window.open(tool.targetURL, "_self")}
                                        className="ai-btn center">

                                        <img height={22} width={22} style={{ borderRadius: "100px", flexShrink: "0", margin: "0px 3px" }} src={tool.favicon} alt={tool.name} />
                                        {tool.name}

                                   </button>
                              ))}
                         </div>
                         <button className="icon-btn footer-btn shortcuts-btn" onClick={() => setShowShortcuts(!showShortcuts)} title="Shortcuts">
                              <Grid2X2 size={19} />
                              <span className="footer-label">Shortcuts</span>
                         </button>
                    </footer>

                    {/* Shortcuts panel */}
                    {showShortcuts && (
                         <div className="shortcuts-panel">
                              <div className="center" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
                                   <div className="panel-label" style={{ margin: "0px" }}>Quick Shortcuts</div>
                                   <button className="add-shortcut-btn">
                                        +
                                   </button>
                              </div>
                              {shortcuts.map(s => (
                                   <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="shortcut-item">
                                        <span className="shortcut-icon">{s.faviconURL}</span>
                                        <span className="shortcut-name">{s.name}</span>
                                   </a>
                              ))}
                         </div>
                    )}

                    {/* TODO PANEL */}
                    {todoOpen && (
                         <div className="todo-panel">
                              <div className="panel-label">Tasks</div>
                              <TodoList />
                         </div>
                    )}

               </main >
               {/* start by component for adding shortcuts */}
          </>
     );
}
