export default function returnMappedWeatherIcon(weatherCode) {
     if (weatherCode === 0) {
          return {
               main: "Clear Sky",
               wmoIconUrl: "/weather_icons/clear-day.png"
          }
     }
     if (weatherCode === 1) {
          return {
               main: "Mainly clear",
               wmoIconUrl: "/weather_icons/day-clouds.png"
          }
     }
     if (weatherCode === 2) {
          return {
               main: "Partly cloudy",
               wmoIconUrl: "/weather_icons/day-clouds.png"
          }
     }
     if (weatherCode === 3) {
          return {
               main: "Overcast",
               wmoIconUrl: "/weather_icons/clouds.png"
          }
     }
     if (weatherCode === 45) {
          return {
               main: "Foggy",
               wmoIconUrl: "/weather_icons/fog.png"
          }
     }
     if (weatherCode === 48) {
          return {
               main: "Rime fog",
               wmoIconUrl: "/weather_icons/fog.png"
          }
     }
     if (weatherCode >= 51 && weatherCode <= 57) {
          return {
               main: "Light rain",
               wmoIconUrl: "/weather_icons/drizzle.png"
          }
     }
     if (weatherCode >= 61 && weatherCode <= 67) {
          return {
               main: "Rain",
               wmoIconUrl: "/weather_icons/rainy.png"
          }
     }
     if (weatherCode >= 80 && weatherCode <= 82) {
          return {
               main: "Heavy rain",
               wmoIconUrl: "/weather_icons/heavy-rain.png"
          }
     }
     if (weatherCode >= 85 && weatherCode <= 86) {
          return {
               main: "Snow fall",
               wmoIconUrl: "/weather_icons/snowfall.png"
          }
     }
     if (weatherCode >= 71 && weatherCode <= 77) {
          return {
               main: "Snow",
               wmoIconUrl: "/weather_icons/snowy.png"
          }
     }
     if (weatherCode === 95) {
          return {
               main: "Thunderstorm",
               wmoIconUrl: "/weather_icons/thunderstorm.png"
          }
     }
     if (weatherCode === 96) {
          return {
               main: "Hailstones",
               wmoIconUrl: "/weather_icons/hail.png"
          }
     }
     if (weatherCode === 99) {
          return {
               main: "Heavy thunderstorm",
               wmoIconUrl: "/weather_icons/heavy-thunder.png"
          }
     }

     return {
          main: "Clear",
          wmoIconUrl: "/weather_icons/clear-day.png"
     }
}
