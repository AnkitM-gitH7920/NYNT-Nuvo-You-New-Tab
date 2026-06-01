import "./settings-popup.css";
import "./utilities.css";

import { themes } from "./themes";
import ToggleButton from "./ToggleButton";
import { ChevronRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPopup() {
     const [activeSetting, setActiveSetting] = useState("GENERAL");
     const [appliedThemeIndex, setAppliedThemeIndex] = useState(() => Number(localStorage.getItem("themeIndex")) || 0);

     const settings = {
          appearance: [
               { label: "Theme", type: "theme-selector", value: "slate" },
          ],
          general: [
               { label: "Time Format", type: "select", value: "24h", options: ["12h", "24h"] },
               { label: "Temperature Unit", type: "select", value: "celsius", options: ["Celsius", "Fahrenheit", "Kelvin"] },
               { label: "Show Weather", type: "toggle", value: true },
               { label: "Show Shortcuts", type: "toggle", value: true },
               { label: "Show Tasks", type: "toggle", value: true },
          ],
          search: [
               { label: "Default Search Engine", type: "select", value: "google", options: ["Google", "DuckDuckGo", "Brave", "Bing"] },
               { label: "Open Search in New Tab", type: "toggle", value: false },
               { label: "Show Quick Access", type: "toggle", value: true },
          ],
          about: [
               { label: "Version", type: "info", value: "1.0.0" },
               { label: "Author", type: "info", value: "Nuvo Team" },
               { label: "Last Updated", type: "info", value: "May 31, 2026" },
          ],
     };

     const categoryButtons = [
          { id: "GENERAL", label: "General" },
          { id: "APPEARANCE", label: "Appearance" },
          { id: "CLOCK_AND_GREETING", label: "Clock & Greeting" },
          { id: "SEARCH", label: "Search" },
          { id: "AI_SHORTCUTS", label: "AI Shortcuts" },
          { id: "MUSIC_AND_WEATHER", label: "Music & Weather" },
          { id: "BOOKMARKS", label: "Bookmarks" },
     ];

     // Synced functions
     function handleThemeChange(themeIndex){
          const { bg, dark, light } = themes[themeIndex].colors;
          let root = document.documentElement;
          root.style.setProperty("--bg", bg);
          root.style.setProperty("--dark-bg", dark);
          root.style.setProperty("--light-bg", light);

          localStorage.setItem("themeIndex", themeIndex)
          setAppliedThemeIndex(themeIndex);
     }


     useEffect(() => {
          let root = document.documentElement;
          root.style.setProperty("--bg", themes[appliedThemeIndex].colors.bg);
          root.style.setProperty("--dark-bg", themes[appliedThemeIndex].colors.dark);
          root.style.setProperty("--light-bg", themes[appliedThemeIndex].colors.light);

     }, [appliedThemeIndex])

     return (
          <div className="setting-container">
               {/* Left Sidebar */}
               <div className="settings-sidebar">
                    <span className="settings-title">Settings</span>
                    <ul style={{ flexDirection: "column" }} className="setting-categories">
                         {categoryButtons.map((category) => (
                              <li>
                                   <button
                                        onClick={() => setActiveSetting(category.id)}
                                        className={`category-selector-button alignC ${category.id === activeSetting ? "active" : ""}`}>{category.label}</button>
                              </li>
                         ))
                         }
                    </ul>
               </div>

               {/* Right Content Area */}
               <div className="settings-content">
                    <div className="settings-header">
                         <h2>{categoryButtons.find(c => c.id === activeSetting).label || "Settings"}</h2>
                    </div>

                    <div className="settings-items">
                         {activeSetting === "APPEARANCE" && (
                              <div style={{flexDirection: "column", gap: "10px"}} className="appearance-settings flex">
                                   <div className="setting-item">
                                        <span className="setting-label">Choose Theme</span>
                                        <div className="theme-grid">
                                             {themes.map((theme, index) => (
                                                  <button
                                                       key={theme.id}
                                                       className={`theme-option alignC ${appliedThemeIndex === index ? "active-theme-option" : ""}`}
                                                       title={theme.name}
                                                       onClick={() => handleThemeChange(index)}
                                                  >
                                                       <div className="theme-preview">
                                                            <div className="theme-color-accent" style={{ backgroundColor: theme.colors.dark }}></div>
                                                            <div className="theme-color-main" style={{ backgroundColor: theme.colors.bg }}></div>
                                                            <div className="theme-color-light" style={{ backgroundColor: theme.colors.light }}></div>
                                                       </div>
                                                       <span className="theme-name">{theme.name}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                                   <div className="setting-item">
                                        <span className="setting-label">Background Image</span>
                                        <div className="background-image-controls alignC">
                                             <button className="upload-image-button">
                                                  Upload Image
                                             </button>
                                             <button  className="center"><Trash2 size={20}/></button>
                                        </div>
                                   </div>
                              </div>
                         )}

                         {activeSetting === "GENERAL" && (
                              <div className="general-settings">
                                   {settings.general.map((setting, idx) => (
                                        <div key={idx} className="setting-item">
                                             <label className="setting-label">{setting.label}</label>
                                             {setting.type === "select" && (
                                                  <select className="setting-select" defaultValue={setting.value}>
                                                       {setting.options.map((opt) => (
                                                            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                                                       ))}
                                                  </select>
                                             )}
                                             {setting.type === "toggle" && (
                                                  <div className="toggle-wrapper">
                                                       <ToggleButton />
                                                  </div>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         )}

                         {activeSetting === "SEARCH" && (
                              <div className="search-settings">
                                   {settings.search.map((setting, idx) => (
                                        <div key={idx} className="setting-item">
                                             <label className="setting-label">{setting.label}</label>
                                             {setting.type === "select" && (
                                                  <select className="setting-select" defaultValue={setting.value}>
                                                       {setting.options.map((opt) => (
                                                            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                                                       ))}
                                                  </select>
                                             )}
                                             {setting.type === "toggle" && (
                                                  <div className="toggle-wrapper">
                                                       <ToggleButton />
                                                  </div>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         )}

                         {activeSetting === "about" && (
                              <div className="about-settings">
                                   {settings.about.map((setting, idx) => (
                                        <div key={idx} className="setting-item">
                                             <label className="setting-label">{setting.label}</label>
                                             <span className="setting-value">{setting.value}</span>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}
