const apiKey = '26dd98dca863e99c8bf8b6e885fe741d';
let currentUnit = 'metric';

function getWeather() {
    const cityName = document.getElementById('city-name').value;
    if (!cityName) return;

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeatherByCoords(lat, lon);
            } else {
                alert("City not found");
            }
        })
        .catch(error => alert("Error fetching city data"));
}

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecast(lat, lon);
        })
        .catch(error => alert("Error fetching weather data"));
}

function displayCurrentWeather(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherCondition = data.weather[0].main;
    const icon = data.weather[0].icon;

    document.getElementById('temperature').innerText = `Temperature: ${temp}°`;
    document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${windSpeed} m/s`;
    document.getElementById('weather-condition').innerText = `Condition: ${weatherCondition}`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${icon}.png`;
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data.list);
        })
        .catch(error => console.error("Error fetching forecast:", error));
}

function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    for (let i = 0; i < forecastData.length; i += 8) {
        const dayData = forecastData[i];
        const temp = dayData.main.temp;
        const weatherCondition = dayData.weather[0].main;
        const icon = dayData.weather[0].icon;

        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <p>${new Date(dayData.dt * 1000).toLocaleDateString()}</p>
            <p>${temp}°</p>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${weatherCondition}" />
            <p>${weatherCondition}</p>
        `;
        forecastContainer.appendChild(dayElement);
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function toggleUnit() {
    if (currentUnit === 'metric') {
        currentUnit = 'imperial';
        document.querySelector('.unit-toggle button').innerText = 'Switch to Celsius';
    } else {
        currentUnit = 'metric';
        document.querySelector('.unit-toggle button').innerText = 'Switch to Fahrenheit';
    }
    getWeather();
}

document.getElementById('search-button').addEventListener('click', function() {
    getWeather();
});

document.getElementById('location-button').addEventListener('click', function() {
    getCurrentLocation();
});
