// Css imports
import "./quote-card.css";
import "./weather-card.css";

// Library imports
import { useState, useEffect } from "react";
import { MapPin, Droplets, CloudRain, CloudOff, Quote } from "lucide-react";

// File imports
import { QUOTES } from "./assets.exports";
import returnMappedWeatherIcon from "./mappedWeatherIcons";

export function QuoteCard() {
     const [todayQuote, setTodayQuote] = useState(() => JSON.parse(localStorage.getItem("todayQuote") || "{}"));

     // PURPOSE :- Check if LS have stored quotes, if not read from /src/quotes.json
     useEffect(() => {
          const controller = new AbortController();

          const storedQuote = localStorage.getItem("todayQuote");
          const todayQuote = storedQuote ? JSON.parse(storedQuote) : {};

          const randomQuoteObject = {
               ...QUOTES[Math.floor(Math.random() * QUOTES.length)],
               quoteSavedTS : Date.now()
          }

          if (!Object.keys(todayQuote).length) {
               localStorage.setItem("todayQuote", JSON.stringify(randomQuoteObject));
               setTodayQuote(randomQuoteObject);
               return;
          }

          const quoteSavedTime = String(new Date(todayQuote.quoteSavedTS))
          .split(" ")
          .splice(0, 4)
          .join(" ");

          const onRenderTime = String(new Date())
          .split(" ")
          .splice(0, 4)
          .join(" ");

          if(quoteSavedTime !== onRenderTime){
               localStorage.setItem("todayQuote", JSON.stringify(randomQuoteObject));
               setTodayQuote(randomQuoteObject);
          }

          return () => controller.abort();
     }, [])

     return (
          <div className="right-card right-quote-card">
               <Quote size={23} style={{
                    color: "var(--text)",
                    margin: "10px 5px"
               }}/>
               <p className="quote-text">"{todayQuote?.quote || "The only way to do great work is to love what you do."}"</p>
               <span className="quote-author">— {todayQuote?.author || "Steve Jobs"}</span>
          </div>
     )
}


export function WeatherCard({ weatherInfo }) {
     return (
          <div className="right-card home-weather-card">
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
     )
}
