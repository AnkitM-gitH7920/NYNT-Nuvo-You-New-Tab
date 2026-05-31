import "./settings-popup.css";
import "./utilities.css";

import { useState } from "react";
import ToggleButton from "./ToggleButton";
import { ChevronRight } from "lucide-react";

export default function SettingsPopup() {
     const [activeSetting, setActiveSetting] = useState("SEARCH");

     const themes = [
          { id: "slate", name: "Midnight Slate", colors: { bg: "#bbd6fd", dark: "#4382ec", light: "#e2eeff" } },
          { id: "lavender", name: "Lavender Dusk", colors: { bg: "#b8a9c9", dark: "#4a2c6e", light: "#f7f3fd" } },
          { id: "rustic", name: "Rustic Charm", colors: { bg: "#f19269", dark: "#252422", light: "#ebeae9" } },
          { id: "rose", name: "Charcoal Rose", colors: { bg: "#e05c7a", dark: "#2e2e2e", light: "#fdf0f3" } },
          { id: "yellow", name: "Golden Hour", colors: { bg: "#e7d77c", dark: "#a87d08", light: "#fff6c3" } },
          { id: "pink", name: "Light Pink", colors: { bg: "#f9c8d6", dark: "#ec5e78", light: "#faf2f5" } },
          { id: "sand", name: "Sand Dunes", colors: { bg: "#c9a87c", dark: "#8b4513", light: "#fdf8f0" } },
          { id: "forest", name: "Forest Green", colors: { bg: "#8a9a5b", dark: "#3b4a2f", light: "#f4f5ec" } },
     ];

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

     return (
          <div className="setting-container">
               {/* Left Sidebar */}
               <div className="settings-sidebar">
                    <span className="settings-title">Settings</span>
                    <ul style={{ flexDirection: "column" }} className="setting-categories">
                         {/* {categoryButtons.map((category) => (
                                   <li key={category.id}>
                                        <button
                                             className={`category-selector-button ${activeSetting === category.id ? "active" : ""}`}
                                             onClick={() => setActiveTab(category.id)}
                                        >
                                             <span className="category-icon">{category.icon}</span>
                                             <span>{category.label}</span>
                                             <ChevronRight size={18} className="chevron-icon" />
                                        </button>
                                   </li>
                              ))} */}
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
                              <div className="appearance-settings">
                                   <label className="setting-item">
                                        <span className="setting-label">Choose Theme</span>
                                        <div className="theme-grid">
                                             {themes.map((theme) => (
                                                  <button
                                                       key={theme.id}
                                                       className="theme-option"
                                                       title={theme.name}
                                                       onClick={() => console.log("Theme selected:", theme.id)}
                                                  >
                                                       <div className="theme-preview">
                                                            <div className="theme-color-main" style={{ backgroundColor: theme.colors.bg }}></div>
                                                            <div className="theme-color-accent" style={{ backgroundColor: theme.colors.dark }}></div>
                                                            <div className="theme-color-light" style={{ backgroundColor: theme.colors.light }}></div>
                                                       </div>
                                                       <span className="theme-name">{theme.name}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   </label>
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
