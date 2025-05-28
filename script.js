// Apply theme from localStorage
const prefersDark = localStorage.getItem('theme') === 'dark';
const html = document.documentElement;
const toggle = document.getElementById('darkToggle');
const modeIcon = document.getElementById('modeIcon');

if (prefersDark) {
  html.classList.add('dark');
  if (toggle) toggle.checked = true;
  if (modeIcon) modeIcon.textContent = '🌙';
}

function toggleDarkMode() {
  const isDark = toggle.checked;

  if (isDark) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    modeIcon.textContent = '🌙';
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    modeIcon.textContent = '☀️';
  }
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherInfo = document.getElementById("weatherInfo");
  const apiKey = "f20f391e31cb2426f04d046a6baec21e";

  if (!city) {
    weatherInfo.innerHTML = "Please enter a city name.";
    return;
  }

  weatherInfo.innerHTML = "🔄 Fetching weather...";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      showWeather(data);
    } else {
      weatherInfo.innerHTML = `Error: ${data.message}`;
    }
  } catch (error) {
    weatherInfo.innerHTML = "❌ Failed to fetch weather data.";
  }
}

async function getWeatherByLocation() {
  const weatherInfo = document.getElementById("weatherInfo");

  if (!navigator.geolocation) {
    weatherInfo.innerHTML = "Geolocation is not supported by your browser.";
    return;
  }

  weatherInfo.innerHTML = "📍 Getting your location...";

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = "f20f391e31cb2426f04d046a6baec21e";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === 200) {
        showWeather(data);
      } else {
        weatherInfo.innerHTML = `Error: ${data.message}`;
      }
    } catch (error) {
      weatherInfo.innerHTML = "❌ Failed to fetch weather data.";
    }
  }, () => {
    weatherInfo.innerHTML = "❌ Unable to retrieve your location.";
  });
}

function showWeather(data) {
  const description = data.weather[0].description;
  const formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  document.getElementById("weatherInfo").innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">${data.name}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">${formattedDescription}</p>
      </div>
      <img src="${iconUrl}" alt="${formattedDescription}" class="w-12 h-12" />
    </div>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
        <p class="text-lg font-medium">${data.main.temp} °C</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
        <p class="text-lg font-medium">${data.main.humidity}%</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
        <p class="text-lg font-medium">${data.wind.speed} m/s</p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Feels Like</p>
        <p class="text-lg font-medium">${data.main.feels_like} °C</p>
      </div>
    </div>
  `;
}
