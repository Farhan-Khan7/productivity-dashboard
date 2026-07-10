const body = document.querySelector("body");
const themeBtns = document.querySelectorAll("#theme-btns .theme-select");
// const themeChange = document.querySelectorAll(".theme-select");

const themeVideo = document.querySelector("#theme-video");

const greeting = document.querySelector("#greeting-name");

const currentDate = document.querySelector("#current-date");
const currentTime = document.querySelector("#current-time");

function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  currentDate.textContent = date;
  currentTime.textContent = time;
}
updateDateTime();

let autoMode = true;
let currentTheme = "";

function applyTheme(theme) {
  currentTheme = theme;
  body.setAttribute("theme", theme);

  themeVideo.src = `assets/${theme}-wheather-video.mp4`;

  themeVideo.load();

  themeVideo.play();

  localStorage.setItem("storeTheme", theme);

  if (theme === "morning") {
    greeting.textContent = "Good Morning";
  } else if (theme === "day") {
    greeting.textContent = "Good Afternoon";
  } else if (theme === "evening") {
    greeting.textContent = "Good Evening";
  } else {
    greeting.textContent = "Good Night";
  }
}

function updateThemeBasedOnTime() {
  if (!autoMode) return;
  const hour = new Date().getHours();

  let newTheme = "";

  if (hour >= 6 && hour < 12) {
    newTheme = "morning";
  } else if (hour >= 12 && hour < 18) {
    newTheme = "day";
  } else if (hour >= 18 && hour < 20) {
    newTheme = "evening";
  } else {
    newTheme = "night";
  }
  // Agar theme already wahi hai to kuch mat karo

  if (currentTheme === newTheme) return;
  applyTheme(newTheme);
}

const savedTheme = localStorage.getItem("storeTheme");
const savedMode = localStorage.getItem("themeMode");

if (savedMode === "manual" && savedTheme) {
  autoMode = false;

  applyTheme(savedTheme);
} else {
  autoMode = true;

  updateThemeBasedOnTime();
}
setInterval(updateThemeBasedOnTime, 60000);
setInterval(updateDateTime, 1000);

themeBtns.forEach((buttons) => {
  buttons.addEventListener("click", function (details) {
    const selectedTheme = buttons.dataset.theme;

    if (selectedTheme === "auto") {
      autoMode = true;
      localStorage.setItem("themeMode", "auto");
      updateThemeBasedOnTime();
      return;
    }

    autoMode = false;
    localStorage.setItem("themeMode", "manual");
    applyTheme(selectedTheme);
  });
});

// complete live date and time code

// const quotes = [
//   {
//     quote: "Success is built in silence long before it is seen in public.",
//     author: "— Naval Ravikant",
//   },
//   {
//     quote:
//       "The person who can stay focused while others are distracted will own the future.",
//     author: "— James Clear",
//   },
//   {
//     quote:
//       "Discipline is choosing between what you want now and what you want most.",
//     author: "— Abraham Lincoln",
//   },
//   {
//     quote: "Your comfort zone is the most expensive place to live.",
//     author: "— Alex Hormozi",
//   },
//   {
//     quote: "Small daily improvements create extraordinary results over time.",
//     author: "— Robin Sharma",
//   },
//   {
//     quote:
//       "The hardest worker in the room eventually becomes the most valuable.",
//     author: "— Patrick Bet-David",
//   },
//   {
//     quote: "Talent opens the door, consistency keeps it open.",
//     author: "— Angela Duckworth",
//   },
//   {
//     quote: "The future rewards those who can delay gratification today.",
//     author: "— Morgan Housel",
//   },
//   {
//     quote: "Most people quit when they are one breakthrough away from success.",
//     author: "— Les Brown",
//   },
//   {
//     quote: "Your habits are the architects of your destiny.",
//     author: "— James Clear",
//   },
//   {
//     quote: "Dreams become reality only when action becomes a daily ritual.",
//     author: "— Denzel Washington",
//   },
//   {
//     quote: "You do not rise to your goals, you fall to your systems.",
//     author: "— James Clear",
//   },
//   {
//     quote: "Every expert was once a beginner who refused to quit.",
//     author: "— Helen Hayes",
//   },
//   {
//     quote: "A year from now you will wish you had started today.",
//     author: "— Karen Lamb",
//   },
//   {
//     quote: "Focus is a superpower in a world designed to distract you.",
//     author: "— Cal Newport",
//   },
//   {
//     quote: "Your current situation is not your final destination.",
//     author: "— Nido Qubein",
//   },
//   {
//     quote: "What feels impossible today becomes your warm-up tomorrow.",
//     author: "— David Goggins",
//   },
//   {
//     quote:
//       "The quality of your future depends on what you repeatedly do today.",
//     author: "— Brian Tracy",
//   },
//   {
//     quote: "My Internal Wealth Will Definitely Create My External Wealth...",
//     author: "— Farhan Khan",
//   },
// ];

// function updateQuote() {
//   let randomQuoteIdx = Math.floor(Math.random() * quotes.length);

//   quoteText.textContent = quotes[randomQuoteIdx].quote;
//   quoteAuthor.textContent = quotes[randomQuoteIdx].author;
// }
// updateQuote();

// Quote Chaning JS Done

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteRefreshBtn = document.querySelector("#new-quote-btn");
async function updateQuote() {
  const response = await fetch("https://dummyjson.com/quotes/random");

  const data = await response.json();

  quoteText.textContent = data.quote;

  quoteAuthor.textContent = data.author;
}
updateQuote();
quoteRefreshBtn.addEventListener("click", updateQuote);

// Weather Location
const weatherLocation = document.querySelector("#weather-location");

// location
const locationValue = document.querySelector("#location-value");

// Temperature
const tempValue = document.querySelector("#temp-value");

// Weather Description
const weatherDesc = document.querySelector("#weather-desc");

// Weather Icon
const weatherIcon = document.querySelector("#weather-icon");

// Humidity
const humidityValue = document.querySelector("#humidity-value");

// Wind Speed
const windValue = document.querySelector("#wind-value");

// Feels Like
const feelsLikeValue = document.querySelector("#feels-like-value");

// Refresh Button
const weatherRefreshBtn = document.querySelector("#weather-refresh-btn");

navigator.geolocation.getCurrentPosition((position) => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
});

async function getWeather(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90e75288217a53e1631469e446f3fbb9&units=metric`,
  );

  const data = await response.json();

  locationValue.textContent = `${data.name}, ${data.sys.country}`;

  tempValue.textContent = Math.round(data.main.temp);

  weatherDesc.textContent = data.weather[0].description;

  humidityValue.textContent = data.main.humidity + "%";

  windValue.textContent = Math.round(data.wind.speed) + " km/h";

  feelsLikeValue.textContent = Math.round(data.main.feels_like) + "°C";

  const weatherMain = data.weather[0].main;

  if (weatherMain === "Clear") {
    weatherIcon.className = "ri-sun-fill";
  } else if (weatherMain === "Clouds") {
    weatherIcon.className = "ri-cloudy-2-fill";
  } else if (weatherMain === "Rain") {
    weatherIcon.className = "ri-rainy-fill";
  } else if (weatherMain === "Thunderstorm") {
    weatherIcon.className = "ri-thunderstorms-fill";
  } else if (weatherMain === "Snow") {
    weatherIcon.className = "ri-snowy-fill";
  } else if (weatherMain === "Mist") {
    weatherIcon.className = "ri-mist-fill";
  } else {
    weatherIcon.className = "ri-cloud-line";
  }
}

function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;

    const lon = position.coords.longitude;

    getWeather(lat, lon);
  });
}

getLocation();

weatherRefreshBtn.addEventListener("click", getLocation);

const dashboard = document.querySelector("#dashboard-main");
const todos = document.querySelector("#todo-main");

const navTabs = document.querySelectorAll(".nav-menu .nav-item");

navTabs.forEach((link) => {
  link.addEventListener("click", function () {
    navTabs.forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

    if (link.dataset.page === "dashboard") {
      dashboard.style.display = "flex";
      todos.style.display = "none";
    } else if (link.dataset.page === "todo-list") {
      dashboard.style.display = "none";
      todos.style.display = "initial";
    }
  });
});
