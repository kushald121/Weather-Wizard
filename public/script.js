// Weather App JavaScript

// Create animated stars background
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const numberOfStars = 50;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starsContainer.appendChild(star);
    }
}

// Weather icon mapping
const weatherIcons = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️',
    'dust': '🌫️',
    'sand': '🌫️',
    'ash': '🌫️',
    'squall': '💨',
    'tornado': '🌪️'
};

// Get weather icon based on description
function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    return weatherIcons[desc] || '🌤️';
}

// Format time for hourly forecast
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
    });
}

// Generate mock hourly forecast data
function generateHourlyForecast(currentTemp, weatherType) {
    const forecast = [];
    const now = Date.now() / 1000;
    
    for (let i = 1; i <= 24; i++) {
        const temp = currentTemp + (Math.random() - 0.5) * 6;
        forecast.push({
            time: now + (i * 3600),
            temp: Math.round(temp),
            icon: getWeatherIcon(weatherType)
        });
    }
    
    return forecast;
}

// Generate mock location data
function generateLocationData() {
    const locations = [
        { name: 'Toronto, Canada', temp: 20, icon: '🌤️' },
        { name: 'New York, USA', temp: 18, icon: '☁️' },
        { name: 'London, UK', temp: 15, icon: '🌧️' },
        { name: 'Tokyo, Japan', temp: 22, icon: '☀️' }
    ];
    
    return locations;
}

// Render hourly forecast
function renderHourlyForecast(currentTemp, weatherType) {
    const forecastContainer = document.querySelector('.forecast-scroll');
    if (!forecastContainer) return;
    
    const forecast = generateHourlyForecast(currentTemp, weatherType);
    
    forecastContainer.innerHTML = forecast.slice(0, 12).map(item => `
        <div class="forecast-item fade-in">
            <div class="forecast-time">${formatTime(item.time)}</div>
            <div class="forecast-icon">${item.icon}</div>
            <div class="forecast-temp">${item.temp}°</div>
        </div>
    `).join('');
}

// Render location cards
function renderLocationCards() {
    const locationsContainer = document.querySelector('.location-cards');
    if (!locationsContainer) return;
    
    const locations = generateLocationData();
    
    locationsContainer.innerHTML = locations.map(location => `
        <div class="location-card slide-in">
            <div class="location-info">
                <h3>${location.name.split(',')[0]}</h3>
                <p>${location.name.split(',')[1]}</p>
            </div>
            <div class="location-weather">
                <div class="location-temp">${location.temp}°</div>
                <div class="location-icon">${location.icon}</div>
            </div>
        </div>
    `).join('');
}

// Add loading state to form
function addLoadingState() {
    const form = document.querySelector('.search-form');
    const submitBtn = document.querySelector('.submit-btn');

    if (form && submitBtn) {
        form.addEventListener('submit', function(e) {
            // Show loading state
            submitBtn.innerHTML = '<span class="loading"></span> Getting Weather...';
            submitBtn.disabled = true;

            // Show loading screen
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.display = 'flex';
                loadingScreen.classList.remove('hidden');
            }

            // The form will submit normally and reload the page
            // The server will handle the weather data fetching
        });
    }
}

// Add smooth scrolling to forecast
function addSmoothScrolling() {
    const forecastScroll = document.querySelector('.forecast-scroll');
    if (forecastScroll) {
        let isDown = false;
        let startX;
        let scrollLeft;

        forecastScroll.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - forecastScroll.offsetLeft;
            scrollLeft = forecastScroll.scrollLeft;
        });

        forecastScroll.addEventListener('mouseleave', () => {
            isDown = false;
        });

        forecastScroll.addEventListener('mouseup', () => {
            isDown = false;
        });

        forecastScroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - forecastScroll.offsetLeft;
            const walk = (x - startX) * 2;
            forecastScroll.scrollLeft = scrollLeft - walk;
        });
    }
}

// Update weather icon in main display
function updateMainWeatherIcon() {
    const weatherDescription = document.querySelector('.weather-description');
    const houseContainer = document.querySelector('.house-container');

    if (weatherDescription && houseContainer) {
        const description = weatherDescription.textContent;
        const icon = getWeatherIcon(description);

        // Remove existing weather icon
        const existingIcon = houseContainer.querySelector('.weather-icon');
        if (existingIcon) {
            existingIcon.remove();
        }

        // Add new weather icon
        const iconElement = document.createElement('div');
        iconElement.className = 'weather-icon';
        iconElement.textContent = icon;
        houseContainer.appendChild(iconElement);

        // Update background based on weather
        updateWeatherBackground(description);
    }
}

// Update background based on weather condition
function updateWeatherBackground(description) {
    const body = document.body;
    const desc = description.toLowerCase();

    // Remove existing weather classes
    body.classList.remove('weather-rain', 'weather-snow', 'weather-clear', 'weather-clouds');

    if (desc.includes('rain') || desc.includes('drizzle')) {
        body.classList.add('weather-rain');
        createRainEffect();
    } else if (desc.includes('snow')) {
        body.classList.add('weather-snow');
        createSnowEffect();
    } else if (desc.includes('clear')) {
        body.classList.add('weather-clear');
    } else if (desc.includes('cloud')) {
        body.classList.add('weather-clouds');
    }
}

// Create rain effect
function createRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    rainContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(transparent, rgba(255,255,255,0.6), transparent);
            left: ${Math.random() * 100}%;
            animation: fall ${Math.random() * 1 + 0.5}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        rainContainer.appendChild(drop);
    }

    document.body.appendChild(rainContainer);

    // Add rain animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to { transform: translateY(100vh); }
        }
    `;
    document.head.appendChild(style);
}

// Create snow effect
function createSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    snowContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;

    for (let i = 0; i < 30; i++) {
        const flake = document.createElement('div');
        flake.textContent = '❄';
        flake.style.cssText = `
            position: absolute;
            color: rgba(255,255,255,0.8);
            font-size: ${Math.random() * 10 + 10}px;
            left: ${Math.random() * 100}%;
            animation: snowfall ${Math.random() * 3 + 2}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        snowContainer.appendChild(flake);
    }

    document.body.appendChild(snowContainer);

    // Add snow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes snowfall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Initialize app
function initializeApp() {
    // Hide loading screen
    hideLoadingScreen();

    // Create stars background
    createStars();

    // Add loading state to form
    addLoadingState();

    // Add smooth scrolling
    addSmoothScrolling();

    // Check if weather data exists and render components
    const weatherData = document.querySelector('.main-weather');
    if (weatherData) {
        const tempElement = document.querySelector('.temperature');
        const descElement = document.querySelector('.weather-description');

        if (tempElement && descElement) {
            const currentTemp = parseInt(tempElement.textContent);
            const weatherType = descElement.textContent;

            // Update main weather icon
            updateMainWeatherIcon();

            // Render hourly forecast
            renderHourlyForecast(currentTemp, weatherType);
        }
    }

    // Always render location cards
    renderLocationCards();

    // Add fade-in animation to main elements
    const mainElements = document.querySelectorAll('.main-weather, .search-form, .error-message');
    mainElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, index * 200);
    });

    // Reset form button state if there's an error
    const submitBtn = document.querySelector('.submit-btn');
    const errorMessage = document.querySelector('.error-message');
    if (submitBtn && errorMessage) {
        submitBtn.innerHTML = 'Get Weather';
        submitBtn.disabled = false;
    }
}

// Fill test data function
function fillTestData(pin, country) {
    const pinInput = document.getElementById('pin');
    const countrySelect = document.getElementById('country');

    if (pinInput && countrySelect) {
        pinInput.value = pin;
        countrySelect.value = country;
    }
}

// Make fillTestData available globally
window.fillTestData = fillTestData;

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.location-card, .forecast-item');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            card.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / 10}deg) rotateY(${(x - rect.width / 2) / 10}deg)`;
        } else {
            card.style.transform = '';
        }
    });
});
