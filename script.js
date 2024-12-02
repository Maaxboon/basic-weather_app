let currentUnit = "Celsius";
let currentTemperature = null; // Store temperature in Kelvin
let hourlyTemperatures = []; // Store hourly temperatures in Kelvin

function getWeather() {
  const apiKey = "62ca33fbf36e0cbcf1ef51a1e098b5a3"; // Move your API key to .gitignore later
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Show loading indicator
  document.getElementById("loading").classList.remove("hidden");

  fetch(currentWeatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data);
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      alert("Error fetching current weather data. Please try again.");
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      displayHourlyForecast(data.list);
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error);
      alert("Error fetching hourly forecast data. Please try again.");
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Clear previous content
  weatherInfoDiv.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    currentTemperature = data.main.temp;
    const temperature = convertTemperature(currentTemperature);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHTML = `
      <p>${temperature}</p>
    `;

    const weatherHtml = `
      <p>${cityName}</p>
      <p>${description}</p>
    `;

    tempDivInfo.innerHTML = temperatureHTML;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;

    showImage();
  }

  // Hide loading indicator
  document.getElementById("loading").classList.add("hidden");
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");

  // Store the hourly temperatures in Kelvin
  hourlyTemperatures = hourlyData.slice(0, 8).map((item) => item.main.temp);

  const next24Hours = hourlyData.slice(0, 8);

  next24Hours.forEach((item, index) => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = convertTemperature(hourlyTemperatures[index]);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Use 2x size for better display

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}

function toggleTemperatureUnit() {
  const tempToggle = document.getElementById("temp-toggle");
  currentUnit = tempToggle.checked ? "Fahrenheit" : "Celsius";

  updateTemperature();
  updateHourlyForecast();
  // Refresh weather icon and hourly icons when toggling
  getWeather(); // Re-fetch weather data and update icons based on the new unit
}

function updateTemperature() {
  const tempDivInfo = document.getElementById("temp-div");
  if (currentTemperature === null) return;

  const displayedTemperature = convertTemperature(currentTemperature);
  tempDivInfo.innerHTML = `<p>${displayedTemperature}</p>`;
}

function updateHourlyForecast() {
  const hourlyForecastDiv = document.getElementById("hourly-forecast");
  hourlyForecastDiv.innerHTML = ""; // Clear the previous hourly forecast

  hourlyTemperatures.forEach((temp, index) => {
    const dateTime = new Date();
    const hour = dateTime.getHours() + index; // Adjust to display the next few hours
    const temperature = convertTemperature(temp);
    const iconUrl = `https://openweathermap.org/img/wn/someIcon.png`; // Replace with actual icon logic

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}</span>
      </div>
    `;

    hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}

function convertTemperature(kelvin) {
  let temperature;
  if (currentUnit === "Celsius") {
    temperature = Math.round(kelvin - 273.15) + "°C";
  } else {
    temperature = Math.round(((kelvin - 273.15) * 9) / 5 + 32) + "°F";
  }
  return temperature;
}
