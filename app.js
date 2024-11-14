const API_KEY = "572c2e60cb35d324416de20497275da2"; // Replace with your OpenWeatherMap API key
const weatherIcons = {
  Clear: "sun",
  Clouds: "cloud",
  Rain: "cloud-rain",
  Snow: "snowflake",
  Thunderstorm: "bolt",
  Drizzle: "cloud-rain",
  Mist: "smog",
};

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  showLoading(true);
  showError("");

  try {
    const weatherData = await fetchWeatherData(city);
    const forecastData = await fetchForecastData(city);

    updateWeatherUI(weatherData);
    updateForecastUI(forecastData);

    showLoading(false);
  } catch (error) {
    showError("City not found or error fetching weather data");
    showLoading(false);
  }
}

async function fetchWeatherData(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) throw new Error("City not found");

  return await response.json();
}

async function fetchForecastData(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) throw new Error("Forecast data not found");

  return await response.json();
}

function updateWeatherUI(data) {
  const weatherCard = document.querySelector(".weather-card");
  const weatherIcon = weatherCard.querySelector(".weather-icon i");
  const temperature = weatherCard.querySelector(".temperature");
  const description = weatherCard.querySelector(".description");
  const humidity = weatherCard.querySelector(".humidity");
  const wind = weatherCard.querySelector(".wind");
  const pressure = weatherCard.querySelector(".pressure");
  const visibility = weatherCard.querySelector(".visibility");

  const iconName = weatherIcons[data.weather[0].main] || "cloud";
  weatherIcon.className = `fas fa-${iconName}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
  visibility.textContent = `Visibility: ${(data.visibility / 1000).toFixed(
    1
  )} km`;
}

function updateForecastUI(data) {
  const forecastContainer = document.querySelector(".forecast");
  forecastContainer.innerHTML = "";

  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

  dailyForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const iconName = weatherIcons[forecast.weather[0].main] || "cloud";

    const forecastCard = document.createElement("div");
    forecastCard.className = "forecast-card";
    forecastCard.innerHTML = `
                <div>${date.toLocaleDateString("en-US", {
                  weekday: "short",
                })}</div>
                <i class="fas fa-${iconName}"></i>
                <div>${Math.round(forecast.main.temp)}°C</div>
            `;

    forecastContainer.appendChild(forecastCard);
  });
}

function showLoading(show) {
  const loading = document.querySelector(".loading");
  loading.classList.toggle("active", show);
}

function showError(message) {
  const error = document.querySelector(".error");
  error.textContent = message;
  error.style.display = message ? "block" : "none";
}

// Theme toggling
const themeToggle = document.querySelector(".theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const icon = themeToggle.querySelector("i");
  icon.className = document.body.classList.contains("dark-mode")
    ? "fas fa-sun"
    : "fas fa-moon";
});

// Enter key support
document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});
