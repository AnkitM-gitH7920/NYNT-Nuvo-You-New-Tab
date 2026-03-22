import "./App.css";
import TodoList from "./TodoList";
import { useState, useEffect } from "react";
import { ListTodo, Search, Cloud, Settings, Grid2X2, ChevronRight, X } from "lucide-react";

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
     const [showAddShortcut, setShowAddShortcut] = useState(false);
     const [shortcuts, setShortcuts] = useState([{ name: "YouTube", url: "https://youtube.com", faviconURL: "▶" }]);
     const [temperature, setTemperature] = useState("");

     const hours = String(time.getHours()).padStart(2, "0");
     const minutes = String(time.getMinutes()).padStart(2, "0");
     const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     const dateString = `${days[time.getDay()]}, ${months[time.getMonth()]} ${time.getDate()}`;
     const greeting = time.getHours() < 12 ? "Good morning" : time.getHours() < 17 ? "Good afternoon" : "Good evening";

     function saveShortcuts(arr) { setShortcuts(arr); localStorage.setItem("shortcuts", JSON.stringify(arr)); }
     function removeShortcut(i) { saveShortcuts(shortcuts.filter((_, j) => j !== i)); }
     function doSearch(e) { e.preventDefault(); if (query.trim()) window.open(SEARCH_ENGINES[engine].url + encodeURIComponent(query), "_self"); }

     return (
          <>
               <main className="root">
                    <nav className="main-nav">
                         <div className="nav-left">
                              <button className="icon-btn" onClick={() => setTodoOpen(!todoOpen)} title="To-do"><ListTodo size={19} /></button>
                         </div>
                         <div className="nav-right">
                              <form className="search-wrapper" onSubmit={doSearch}>
                                   <Search size={19} className="search-icon" />
                                   <input placeholder="Search with Google" type="text" className="nav-search" value={query} onChange={e => setQuery(e.target.value)} />
                                   <img src="google.png" alt="Google" loading="lazy" height={18} width={18} />
                              </form>
                              <button className="icon-btn" title="Spotify"><img src="spotify.svg" alt="Spotify" width={22} height={22} style={{ filter: "contrast(0.8)" }} /></button>
                              <button className="icon-btn" title="Weather"><Cloud size={19} /></button>
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
                              <div className="right-card spotify-card">
                                   <div className="card-label">Now Playing</div>
                                   <div className="spotify-art">♫</div>
                                   <div className="spotify-track">Not connected</div>
                                   <div className="spotify-artist">Connect Spotify to play music</div>
                                   <button className="connect-btn">Connect Spotify</button>
                              </div>
                              <div className="right-card weather-card">
                                   <div className="card-label">Weather</div>
                                   <div className="weather-temp">{temperature.length ? temperature : "_"}°</div>
                                   <div className="weather-desc">Allow location access</div>
                              </div>
                              <div className="right-card quote-card">
                                   <div className="card-label">Quote</div>
                                   <p className="quote-text">"The only way to do great work is to love what you do."</p>
                                   <span className="quote-author">— Steve Jobs</span>
                              </div>
                         </section>
                    </div>

                    <footer className="main-footer">
                         <button className="icon-btn footer-btn" title="Settings"><Settings size={19} /><span className="footer-label">Settings</span></button>
                         <div className="ai-tools center">
                              {AI_TOOLS.map((tool, i) => (
                                   <button key={i} onClick={() => window.open(tool.targetURL, "_self")} className="ai-btn center">
                                        <img height={15} width={15} style={{ borderRadius: "100px", flexShrink: "0" }} src={tool.favicon} alt={tool.name} />
                                        {tool.name}
                                   </button>
                              ))}
                         </div>
                         <button className="icon-btn footer-btn" onClick={() => setShowShortcuts(!showShortcuts)} title="Shortcuts"><Grid2X2 size={19} /><span className="footer-label">Shortcuts</span></button>
                    </footer>

                    {showShortcuts && (
                         <div className="shortcuts-panel">
                              <div className="center" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
                                   <div className="panel-label" style={{ margin: "0px" }}>Quick Shortcuts</div>
                                   <button onClick={() => setShowAddShortcut(true)} className="add-shortcut-btn">+</button>
                              </div>
                              {shortcuts.length ? (
                                   shortcuts.map((s, i) => (
                                        <div key={i} className="shortcut-item" style={{ justifyContent: "space-between" }}>
                                             <a style={{ gap: "8px" }} className="alignC" href={s.url} target="_self" title={s.name}>
                                                  <span className="shortcut-icon">{s.faviconURL}</span>
                                                  <span className="shortcut-name">{s.name}</span>
                                             </a>
                                             <button onClick={() => removeShortcut(i)} className="remove-shortcut-btn">✕</button>
                                        </div>
                                   ))
                              ) : (
                                   <div style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>No added shortcuts</div>
                              )}
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
                              onClose={() => setShowAddShortcut(false)}
                              onAdd={(shortcut) => {
                                   setShowAddShortcut(false);
                              }}
                         />
                    )}
               </main>
          </>
     );
}

function AddShortcutPane({ onClose, onAdd }) {
     const [name, setName] = useState("");
     const [url, setUrl] = useState("");

     return (
          <div className="add-shortcutpane-wrapper" onClick={onClose}>
               <div className="add-shortcutpane-container" onClick={e => e.stopPropagation()}>
                    <div className="add-shortcutpane-head">
                         <span className="add-shortcutpane-title">Add Shortcut</span>
                         <button className="add-shortcutpane-close" onClick={onClose}><X size={16} /></button>
                    </div>
                    <div className="add-shortcutpane-body">
                         <input className="add-shortcutpane-input" placeholder="Shortcut name..." type="text" value={name} onChange={e => setName(e.target.value)} />
                         <input className="add-shortcutpane-input" placeholder="Shortcut URL..." type="text" value={url} onChange={e => setUrl(e.target.value)} />
                         <button className="add-shortcutpane-submit" onClick={() => onAdd({ name, url })}>Add Shortcut</button>
                    </div>
               </div>
          </div>
     );
}
