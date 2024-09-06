const citiesInputEl =document.getElementById('city-input')
const searchFormEl = document.getElementById('search-form')
const cityWeatherEl = document.getElementById('city-weather')
const key = "f27ce85670a99a4166190adb76e403ba"

const weatherEmojis = {
    clear: "☀️",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
    smoke: "💨",
    haze: "🌫️",
    dust: "🌪️",
    fog: "🌁",
    sand: "🌪️",
    ash: "🌋",
    squall: "🌬️",
    tornado: "🌪️"
};

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

searchFormEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const city = citiesInputEl.value
    getWeather(city)

})

async function getWeather(city){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`)
        if (!response.ok) {
            throw new Error('City not found');
          }
        const data = await response.json()
        const weatherInfo = {
            city: data.name,
            temp: Math.floor(data.main.temp),
            humidity: data.main.humidity,
            wind: data.wind.speed,
            weather: data.weather[0].main,
            icon: weatherEmojis[data.weather[0].main.toLowerCase()],
            date: getDate()
        }
        localStorage.setItem('weather', JSON.stringify(weatherInfo))
        renderData(weatherInfo)
    } catch (error) {
        console.error(error)
        alert(error)
    }
}

function renderData(data = JSON.parse(localStorage.getItem('weather'))){
    const { city, temp, humidity, wind, weather, icon, date } = data
    const html = `
            <p class="weather-icon">${icon}</p>
            <div class="card">
                <p class="date">${date}</p>
                <p class="temp">${temp}°</p>
                <p class="city">${city}</p>
                <p class="weather">${weather}</p>
                <div class="weather-info">
                    <i class="fa-solid fa-wind"></i>
                    <p class="info">wind</p>
                    <p>${wind} Km/h</p>
                </div>
                <div class="weather-info">
                    <i class="fa-solid fa-droplet"></i>
                    <p class="info">hum</p>
                    <p>${humidity}%</p>
                </div>
            </div>
            <div id="forecast"></div>
            <button class="btn-forecast" id="btn-forecast" onclick="getForecastWeather()">Forecast report</button>
    `
    cityWeatherEl.innerHTML = html
}


function getDate(){
    const today = new Date()
    const day = today.getDate()
    const month = monthNames[today.getMonth()]
    return `Today, ${day} ${month}`
}

async function getForecastWeather(){
    try {
        const city = JSON.parse(localStorage.getItem('weather')).city
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${key}`)
        if (!response.ok) {
            throw new Error('City not found');
          }
        const data = await response.json()
        document.getElementById('forecast').innerHTML = renderForecast(data)
    } catch (error) {
        console.error(error)
        alert(error)
    }
}

function renderForecast(data){
    return `
            <div class="forecast-section">
            ${renderForecastItems(data.list)}
            </div>
            `
}

function renderForecastItems(forecastList){
    return forecastList.map(item => {
        const forecastItem  = {
            month : `${monthNames[Number(item.dt_txt.slice(5,7)) - 1].slice(0,4)}.`,
            day: item.dt_txt.slice(8,10),
            hour: item.dt_txt.slice(11,16),
            temp: Math.floor(item.main.temp),
            img: weatherEmojis[item.weather[0].main.toLowerCase()]
        }
        const { month, day, hour, temp, img } = forecastItem 
        document.getElementById('btn-forecast').disabled = true
        return ` 
        <div class="forecast-card">
            <p>${month} ${day}</p>
            <p>${hour}</p>
            <p>${img}</p>
            <p>${temp}°C</p>
        </div>`
    }).join('')
}