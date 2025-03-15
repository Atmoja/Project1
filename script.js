function getWeather() {
    let location = document.getElementById("location").value.trim();
    if (location === "") {
        alert("Please enter a city name");
        return;
    }

    let apiKey = "Your API key"
    let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("weatherResult").innerHTML = "❌ City not found!";
                document.getElementById("part2").innerHTML = getPart2Placeholder(); // Show default placeholder
            } else {
                let temp = data.current.temp_c;
                let condition = data.current.condition.text;
                document.getElementById("weatherResult").innerHTML = `
                    <h2>${data.location.name}, ${data.location.country}</h2>
                    <p>🌡 Temperature: ${temp}°C</p>
                    <p>🌤 Condition: ${condition}</p>
                    <img id="weatherImage" src="https:${data.current.condition.icon}" alt="Weather Icon">
                `;

                // Fetch and display 7-day forecast
                get7DayForecast(location);
            }
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
            alert("⚠️ Failed to fetch weather data. Please try again.");
        });
}

function get7DayForecast(location) {
    let apiKey = "Your API key"
    let url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("part2").innerHTML = "⚠️ Forecast not available!";
            } else {
                let forecastHTML = `
                    <h3>📅 7-Day Forecast</h3>
                    <p id="forecast-instruction">🔍 Tap on any day below to see detailed weather info!</p>
                    <div class="forecast-container">
                `;

                data.forecast.forecastday.forEach((day, index) => {
                    forecastHTML += `
                        <div class="forecast-item" onclick="showDayDetails(${index})">
                            <p><strong>${formatDate(day.date)}</strong></p>
                            <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                            <p>${day.day.condition.text}</p>
                            <p>🌡 ${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</p>
                        </div>
                    `;
                });

                forecastHTML += `</div>
                    <div id="dayDetails">
                        <h3>ℹ️ Day Details</h3>
                        <p>Tap on a day to view more details.</p>
                    </div>
                `;

                document.getElementById("part2").innerHTML = forecastHTML;

                // Store forecast data globally
                window.forecastData = data.forecast.forecastday;
            }
        })
        .catch(error => {
            console.error("Error fetching 7-day forecast:", error);
            alert("⚠️ Failed to fetch forecast data. Please try again.");
        });
}

function showDayDetails(index) {
    let selectedDay = window.forecastData[index];

    document.getElementById("dayDetails").innerHTML = `
        <h3> Details for ${formatDate(selectedDay.date)}</h3>
        <img src="https:${selectedDay.day.condition.icon}" alt="Weather Icon">
        <p><strong>🌤 Condition:</strong> ${selectedDay.day.condition.text}</p>
        <p><strong>🌡 Max Temp:</strong> ${selectedDay.day.maxtemp_c}°C</p>
        <p><strong>🌡 Min Temp:</strong> ${selectedDay.day.mintemp_c}°C</p>
        <p><strong>💧 Humidity:</strong> ${selectedDay.day.avghumidity}%</p>
        <p><strong>💨 Wind Speed:</strong> ${selectedDay.day.maxwind_kph} km/h</p>
    `;
}

// Function to format the date nicely
function formatDate(dateString) {
    let options = { weekday: 'long', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to return placeholder message for part2 before searching
function getPart2Placeholder() {
    return `
        <div id="part2-placeholder">
            <img src="cloudy.png" alt="Weather Icon" width="60">
            <p>📌 Enter a city name to see the 7-day forecast!</p>
        </div>
    `;
}

// Show initial placeholder in Part 2
document.getElementById("part2").innerHTML = getPart2Placeholder();
