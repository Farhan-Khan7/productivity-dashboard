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

// theme logic done 


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

// quote logic done 

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
const todoDashboard = document.querySelector(".todo-main");

const navTabs = document.querySelectorAll(".nav-menu .nav-item");

navTabs.forEach((link) => {
  link.addEventListener("click", function () {
    navTabs.forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

    if (link.dataset.page === "dashboard") {
      dashboard.style.display = "flex";
      todoDashboard.style.display = "none";
    } else if (link.dataset.page === "todo-list") {
      dashboard.style.display = "none";
      todoDashboard.style.display = "flex";
    }
  });
});






// todos section start

// Task Input
const taskInput = document.querySelector("#task-input");

// Important Checkbox
const importantCheckbox = document.querySelector("#important-checkbox");

// Due Date
const taskDate = document.querySelector("#task-date");
const today = new Date().toISOString().split("T")[0];
taskDate.min = today;
taskDate.setAttribute("min", today)

// Add Button
const addTaskBtn = document.querySelector("#add-task-btn");

// Todo List Container
const todoList = document.querySelector(".todo-list"); // apni ul ki id likhna

// Empty State
const emptyState = document.querySelector(".empty-state"); // agar hai to

// Counters (agar hai)
const totalTaskCount = document.querySelector("#total-task-count");
const todayTaskCount = document.querySelector("#today-task-count");
const completedTaskCount = document.querySelector("#completed-task-count");
const emptyMessage = document.querySelector(".empty-message")


let todos = [];

function renderTodos() {

  if (todos.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
  }

  let todoHTML = "";
  todoList.innerHTML = ""

  todos.forEach((todo) => {
    const formattedDate = new Date(todo.dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    todoHTML += `<li class="todo-item">

                  <!-- Left -->

                  <div class="todo-left">

                    <!-- Task -->

                    <input type="text" class="todo-title" value="${todo.taskdesc}" readonly>

                  </div>

                  <!-- Due Date -->

                  <span class="todo-tag date-tag">

                    <!-- <i class="ri-calendar-line"></i> -->

                    ${formattedDate}

                  </span>

                  <!-- Important -->

                  ${todo.isImportant ? `<span class="todo-tag important-tag">

                    <i class="ri-star-fill"></i>

                  </span>`: ""}


                  <!-- Edit -->

                  <div class="todo-actions">
                    <button class="todo-btn edit-btn" title="Edit Task">

                      <i class="ri-edit-2-line"></i>

                    </button>

                    <!-- Delete -->

                    <button class="todo-btn delete-btn" title="Delete Task">

                      <i class="ri-delete-bin-line"></i>

                    </button>
                  </div>



                </li>`


  })
  todoList.innerHTML = todoHTML;

  renderDashboardTodos()

}


const dashboardTodos = document.querySelector(".dashboard-todos");
function renderDashboardTodos(){
  dashboardTodos.innerHTML = "";
  const today = new Date().toLocaleDateString("en-CA");

  let todayTodos = todos.filter((todo) => {
    return todo.dueDate === today
  })

   console.log("Today:", today);

console.log("Todos:", todos);

console.log("Filtered:", todayTodos);
  let dashboardTodoItem = "";
  todayTodos.forEach((todo) =>{

    dashboardTodoItem += `<div class="dashboard-items">
                  <span>${todo.taskdesc}</span>
                  <div class="dashboard-todo-tags">
                    ${todo.isImportant? `<span class="dashboard-important-tag">
                      <i class="ri-star-fill"></i>
                    </span>`: ""}
                  <button class="complete-btn" title="Complete Task">
                    <i class="ri-check-double-line"></i>
                  </button>
                  </div>
                </div>`
  })

  dashboardTodos.innerHTML = dashboardTodoItem;
}


function resetInputs() {
  taskInput.value = "";
  importantCheckbox.checked = false;
  taskDate.value = "";
}
renderTodos()

function addTodos() {
  let taskdesc = taskInput.value.trim();
  let isImportant = importantCheckbox.checked;
  let dueDate = taskDate.value;

  if (taskdesc === "") {
    alert("Enter a task before adding.")
    return
  } else if (dueDate === "") {
    alert("Please select a due date.");
    return;
  } else if (taskDate.value < today) {
    alert("Please select today or a future date.")
    return
  }

  const todoDetails = {
    id: Date.now(),
    taskdesc,
    isImportant,
    dueDate,
    complete: false
  }

  if (isImportant) {
    todos.unshift(todoDetails)
  } else {
    todos.push(todoDetails)
  }

  localStorage.setItem("todoItem", JSON.stringify(todos));

  renderTodos()
  resetInputs()
  renderDashboardTodos()

}


addTaskBtn.addEventListener("click", addTodos)



renderTodos();

function loadPage() {

  const storedTodo = localStorage.getItem("todoItem");

  if (storedTodo) {

    todos = JSON.parse(storedTodo);

    renderTodos();
    renderDashboardTodos()

  }

}
loadPage();