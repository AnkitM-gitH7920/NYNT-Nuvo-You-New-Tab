export default function returnMappedWeatherIcon(weatherCode) {
     const time = new Date();
     const hour = time.getHours();
     const day = hour > 6 && hour < 18;

     // Thunderstorm
     if (weatherCode >= 200 && weatherCode <= 232) {
          return { main: "Thunderstorm", wmoIconUrl: "/weather_icons/heavy_thunder.png" }
     }
     // Drizzle
     if (weatherCode >= 300 && weatherCode <= 321) {
          return { main: "Light rain", wmoIconUrl: "/weather_icons/drizzle.png" }
     }
     // Rain
     if (weatherCode >= 500 && weatherCode <= 504) {
          return { main: "Rain", wmoIconUrl: "/weather_icons/rainy.png" }
     }
     if (weatherCode === 511) {
          return { main: "Freezing rain", wmoIconUrl: "/weather_icons/heavy-rain.png" }
     }
     if (weatherCode >= 520 && weatherCode <= 531) {
          return { main: "Heavy rain", wmoIconUrl: "/weather_icons/heavy-rain.png" }
     }
     // Snow
     if (weatherCode >= 600 && weatherCode <= 622) {
          return { main: "Snow", wmoIconUrl: "/weather_icons/snowfall.png" }
     }
     // Fog/Mist
     if (weatherCode >= 700 && weatherCode <= 781) {
          return { main: "Foggy", wmoIconUrl: "/weather_icons/fog.png" }
     }
     // Clear
     if (weatherCode === 800) {
          return day ?
               { main: "Clear Sky", wmoIconUrl: "/weather_icons/clear-day.png" } :
               { main: "Clear night sky", wmoIconUrl: "/weather_icons/clear-night.png" }
     }
     // Clouds
     if (weatherCode === 801) {
          return day ?
               { main: "Mainly clear", wmoIconUrl: "/weather_icons/day-clouds.png" } :
               { main: "Mainly clear", wmoIconUrl: "/weather_icons/night-clouds.png" }
     }
     if (weatherCode === 802) {
          return day ?
               { main: "Partly cloudy", wmoIconUrl: "/weather_icons/day-clouds.png" } :
               { main: "Partly cloudy", wmoIconUrl: "/weather_icons/night-clouds.png" }
     }
     if (weatherCode === 803 || weatherCode === 804) {
          return { main: "Overcast", wmoIconUrl: "/weather_icons/clouds.png" }
     }

     return { main: "Clear", wmoIconUrl: "/weather_icons/clear-day.png" }
}
