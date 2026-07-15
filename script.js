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

// navigator.geolocation.getCurrentPosition((position) => {
//   let lat = position.coords.latitude;
//   let lon = position.coords.longitude;
// });

// async function getWeather(lat, lon) {
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=90e75288217a53e1631469e446f3fbb9&units=metric`,
//   );

//   const data = await response.json();

//   locationValue.textContent = `${data.name}, ${data.sys.country}`;

//   tempValue.textContent = Math.round(data.main.temp);

//   weatherDesc.textContent = data.weather[0].description;

//   humidityValue.textContent = data.main.humidity + "%";

//   windValue.textContent = Math.round(data.wind.speed) + " km/h";

//   feelsLikeValue.textContent = Math.round(data.main.feels_like) + "°C";

//   const weatherMain = data.weather[0].main;

//   if (weatherMain === "Clear") {
//     weatherIcon.className = "ri-sun-fill";
//   } else if (weatherMain === "Clouds") {
//     weatherIcon.className = "ri-cloudy-2-fill";
//   } else if (weatherMain === "Rain") {
//     weatherIcon.className = "ri-rainy-fill";
//   } else if (weatherMain === "Thunderstorm") {
//     weatherIcon.className = "ri-thunderstorms-fill";
//   } else if (weatherMain === "Snow") {
//     weatherIcon.className = "ri-snowy-fill";
//   } else if (weatherMain === "Mist") {
//     weatherIcon.className = "ri-mist-fill";
//   } else {
//     weatherIcon.className = "ri-cloud-line";
//   }
// }

// ================= Dashboard Weather Widget - Dynamic JS =================
// Isolated namespace: dashboardWeather (koi clash nahi weatherTab se)

const dashboardWeather = {
  coords: {
    lat: 23.2599,   // default: Bhopal
    lon: 77.4126,
  },

  refreshIntervalMs: 10 * 60 * 1000, // har 10 min me auto refresh

  nodes: {
    tempValue: document.getElementById("temp-value"),
    desc: document.getElementById("weather-desc"),
    icon: document.getElementById("weather-icon"),
    humidity: document.getElementById("humidity-value"),
    wind: document.getElementById("wind-value"),
    feelsLike: document.getElementById("feels-like-value"),
  },

  // WMO code -> { text, remix icon class }
  codeInfoMap: {
    0: { text: "Clear Sky", icon: "ri-sun-line" },
    1: { text: "Mainly Clear", icon: "ri-sun-line" },
    2: { text: "Partly Cloudy", icon: "ri-cloudy-2-fill" },
    3: { text: "Overcast", icon: "ri-cloud-fill" },
    45: { text: "Fog", icon: "ri-foggy-line" },
    48: { text: "Rime Fog", icon: "ri-foggy-line" },
    51: { text: "Light Drizzle", icon: "ri-drizzle-line" },
    53: { text: "Drizzle", icon: "ri-drizzle-line" },
    55: { text: "Dense Drizzle", icon: "ri-drizzle-line" },
    61: { text: "Slight Rain", icon: "ri-rainy-line" },
    63: { text: "Rain", icon: "ri-rainy-line" },
    65: { text: "Heavy Rain", icon: "ri-heavy-showers-line" },
    71: { text: "Slight Snow", icon: "ri-snowy-line" },
    73: { text: "Snow", icon: "ri-snowy-line" },
    75: { text: "Heavy Snow", icon: "ri-snowy-line" },
    80: { text: "Rain Showers", icon: "ri-showers-line" },
    81: { text: "Rain Showers", icon: "ri-showers-line" },
    82: { text: "Violent Showers", icon: "ri-heavy-showers-line" },
    95: { text: "Thunderstorm", icon: "ri-thunderstorms-line" },
    96: { text: "Thunderstorm + Hail", icon: "ri-thunderstorms-line" },
    99: { text: "Thunderstorm + Hail", icon: "ri-thunderstorms-line" },
  },

  init() {
    this.loadWeather();

    // auto refresh loop (koi refresh button nahi hai is widget me isliye interval based)
    setInterval(() => this.loadWeather(), this.refreshIntervalMs);
  },

  async loadWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.coords.lat}&longitude=${this.coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;

      const response = await fetch(url);
      const payload = await response.json();

      this.updateUI(payload.current);
    } catch (err) {
      console.error("Dashboard weather fetch error:", err);
      this.nodes.desc.textContent = "Unavailable";
    }
  },

  updateUI(current) {
    const info = this.codeInfoMap[current.weather_code] || {
      text: "Unknown",
      icon: "ri-question-line",
    };

    this.nodes.tempValue.textContent = Math.round(current.temperature_2m);
    this.nodes.desc.textContent = info.text;

    // icon class replace (purani remix class hata ke nayi lagayi)
    this.nodes.icon.className = info.icon;
    this.nodes.icon.id = "weather-icon"; // id restore, kyunki className poora overwrite karta hai

    this.nodes.humidity.textContent = `${current.relative_humidity_2m}%`;
    this.nodes.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    this.nodes.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
  },
};

document.addEventListener("DOMContentLoaded", () => dashboardWeather.init());



function getLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;

    const lon = position.coords.longitude;

    getWeather(lat, lon);
  });
}

getLocation();

weatherRefreshBtn.addEventListener("click", getLocation);


// ================= Pomodoro Widget - Dynamic JS =================
// Isolated namespace: pomodoroWidget (weatherTab / dashboardWeather se koi clash nahi)

const pomodoroWidget = {
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,

  remainingSeconds: 25 * 60,
  isRunning: false,
  isFocusMode: true,
  intervalId: null,

  circleCircumference: 0, // ab dynamically calculate hoga init me
  storageKey: "pomodoroWidget-state", // isolated key, koi aur widget use nahi karega

  nodes: {
    display: document.getElementById("timer-display"),
    label: document.getElementById("timer-label"),
    progressRing: document.getElementById("timer-progress"),
    startBtn: document.getElementById("start-btn"),
    pauseBtn: document.getElementById("pause-btn"),
    resetBtn: document.getElementById("reset-btn"),
  },

  init() {
    // circumference ko circle ke actual radius se calculate karo (bug fix)
    const radius = this.nodes.progressRing.getAttribute("r");
    this.circleCircumference = 2 * Math.PI * radius;

    this.nodes.startBtn.addEventListener("click", () => this.startTimer());
    this.nodes.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.nodes.resetBtn.addEventListener("click", () => this.resetTimer());

    this.loadState();
    this.updateDisplay();
    this.updateRing();

    // agar refresh se pehle timer chal raha tha, toh wapas chalu kar do
    if (this.isRunning) {
      this.isRunning = false; // startTimer() dobara true karega
      this.startTimer();
    }
  },

  startTimer() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.saveState();

    this.intervalId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateDisplay();
        this.updateRing();
        this.saveState();
      } else {
        this.switchMode();
      }
    }, 1000);
  },

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.saveState();
  },

  resetTimer() {
    this.pauseTimer();
    this.isFocusMode = true;
    this.remainingSeconds = this.focusDuration;
    this.nodes.label.textContent = "Focus Time";
    this.updateDisplay();
    this.updateRing();
    this.saveState();
  },

  switchMode() {
    this.isFocusMode = !this.isFocusMode;
    this.remainingSeconds = this.isFocusMode
      ? this.focusDuration
      : this.breakDuration;
    this.nodes.label.textContent = this.isFocusMode ? "Focus Time" : "Break Time";
    this.updateDisplay();
    this.updateRing();
    this.saveState();
  },

  updateDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    this.nodes.display.textContent = `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  },

  updateRing() {
    const totalDuration = this.isFocusMode
      ? this.focusDuration
      : this.breakDuration;

    const progressFraction = this.remainingSeconds / totalDuration;
    const offset = this.circleCircumference * (1 - progressFraction);

    this.nodes.progressRing.style.strokeDasharray = this.circleCircumference;
    this.nodes.progressRing.style.strokeDashoffset = offset;
  },

  // ================= localStorage persistence =================

  saveState() {
    const state = {
      remainingSeconds: this.remainingSeconds,
      isFocusMode: this.isFocusMode,
      isRunning: this.isRunning,
      lastSavedAt: Date.now(), // refresh ke beech ka gap calculate karne ke liye
    };
    localStorage.setItem(this.storageKey, JSON.stringify(state));
  },

  loadState() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return;

    try {
      const state = JSON.parse(raw);

      this.isFocusMode = state.isFocusMode;
      this.isRunning = state.isRunning;

      let remaining = state.remainingSeconds;

      // agar timer chal raha tha, toh jitna time refresh me nikla wo minus karo
      if (state.isRunning) {
        const elapsedSeconds = Math.floor((Date.now() - state.lastSavedAt) / 1000);
        remaining -= elapsedSeconds;
      }

      this.remainingSeconds = Math.max(remaining, 0);
      this.nodes.label.textContent = this.isFocusMode ? "Focus Time" : "Break Time";
    } catch (err) {
      console.error("Pomodoro state parse error:", err);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => pomodoroWidget.init());





const dashboard = document.querySelector("#dashboard-main");
const todoDashboard = document.querySelector("#todo-main");
const goalDashboard = document.querySelector("#goal-main");
const plannerDashboard = document.querySelector("#planner-main");
const timerDashboard = document.querySelector("#timer-main");
const weatherDashboard = document.querySelector("#weather-main");
const quoteDashboard = document.querySelector("#quote-main");

const navTabs = document.querySelectorAll(".nav-menu .nav-item");

navTabs.forEach((link) => {
  link.addEventListener("click", function () {
    dashboard.style.display = "none";
    todoDashboard.style.display = "none";
    goalDashboard.style.display = "none";
    plannerDashboard.style.display = "none";
    timerDashboard.style.display = "none";
    weatherDashboard.style.display = "none";
    quoteDashboard.style.display = "none";

    navTabs.forEach((item) => {
      item.classList.remove("active");
    });

    link.classList.add("active");

    if (link.dataset.page === "dashboard") {
      dashboard.style.display = "flex";
    } else if (link.dataset.page === "todo-list") {
      todoDashboard.style.display = "flex";
    } else if (link.dataset.page === "goals") {
      goalDashboard.style.display = "flex";
    } else if (link.dataset.page === "planner") {
      plannerDashboard.style.display = "flex";
    } else if (link.dataset.page === "timer") {
      timerDashboard.style.display = "flex";
    } else if(link.dataset.page === "weather") {
      weatherDashboard.style.display = "flex";
      console.log("clicked")
    } else if(link.dataset.page === "quote") {
      quoteDashboard.style.display = "flex"
      console.log("clicked")
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
const today = new Date().toLocaleDateString("en-CA");
taskDate.min = today;
taskDate.setAttribute("min", today);

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
const emptyMessage = document.querySelector(".empty-message");

let todos = [];
let editingId = null;

function renderTodos() {
  if (todos.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
  }

  let todoHTML = "";
  todoList.innerHTML = "";

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

                  ${
                    todo.isImportant
                      ? `<span class="todo-tag important-tag">

                    <i class="ri-star-fill"></i>

                  </span>`
                      : ""
                  }


                  <!-- Edit -->

                  <div class="todo-actions">
                    <button class="todo-btn edit-btn" title="Edit Task" data-id="${todo.id}">

                      <i class="ri-edit-2-line"></i>

                    </button>

                    <!-- Delete -->

                    <button class="todo-btn delete-btn" title="Delete Task" data-id="${todo.id}">

                      <i class="ri-delete-bin-line"></i>

                    </button>
                  </div>



                </li>`;
  });
  todoList.innerHTML = todoHTML;

  renderDashboardTodos();
}

// Edit Button functionalty

todoList.addEventListener("click", function (event) {
  const editBtn = event.target.closest(".edit-btn");

  if (!editBtn) return;

  const todoItem = editBtn.closest(".todo-item");
  const taskDesc = todoItem.querySelector(".todo-title");
  const id = editBtn.dataset.id;

  if (editingId === null) {
    editBtn.innerHTML = `<i class="ri-check-double-line"></i>`;
    taskDesc.readOnly = false;
    taskDesc.focus();
    editingId = Number(id);
  } else if (editingId === Number(id)) {
    let selectedEditTodos = todos.find((item) => {
      return item.id == editingId;
    });
    selectedEditTodos.taskdesc = taskDesc.value;
    localStorage.setItem("todoItem", JSON.stringify(todos));
    editBtn.innerHTML = ` <i class="ri-edit-2-line"></i>`;
    taskDesc.readOnly = true;
    editingId = null;
    renderTodos();
  } else {
    alert("Please save the current task first.");
  }
});

// delete button functionalty
todoList.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".delete-btn");

  if (!deleteBtn) return;

  const deleteId = Number(deleteBtn.dataset.id);

  todos = todos.filter((item) => {
    return item.id !== deleteId;
  });
  localStorage.setItem("todoItem", JSON.stringify(todos));
  renderTodos();
});

// Dashboard todos Render functionalty
const dashboardTodos = document.querySelector(".dashboard-todos");

function renderDashboardTodos() {
  dashboardTodos.innerHTML = "";
  const today = new Date().toLocaleDateString("en-CA");

  let todayTodos = todos.filter((todo) => {
    return todo.dueDate === today;
  });

  let dashboardTodoItem = "";
  todayTodos.forEach((todo) => {
    dashboardTodoItem += `<div class="dashboard-items">
                  <span class="${todo.complete ? "completed-text" : ""}">${todo.taskdesc}</span>
                  <div class="dashboard-todo-tags">
                    ${
                      todo.isImportant
                        ? `<span class="dashboard-important-tag">
                      <i class="ri-star-fill"></i>
                    </span>`
                        : ""
                    }
                  <button class="todos-complete-btn" title="Complete Task" data-id="${todo.id}">
                    <i class="ri-check-double-line"></i>
                  </button>
                  </div>
                </div>`;
  });

  dashboardTodos.innerHTML = dashboardTodoItem;
  updateStats(); // naya call add kiya
}
// Reset input functionalty
function resetInputs() {
  // todoinputs resets
  taskInput.value = "";
  importantCheckbox.checked = false;
  taskDate.value = "";

  // goalsinputs resets
  goalInput.value = "";
  goalDate.value = "";

  plannerInput.value = "";
  plannerDate.value = "";
  plannerHour.value = "";
  plannerMinute.value = "";
  plannerPeriod.value = "";
}
renderTodos();

// Add todos functionalty
function addTodos() {
  let taskdesc = taskInput.value.trim();
  let isImportant = importantCheckbox.checked;
  let dueDate = taskDate.value;

  if (taskdesc === "") {
    alert("Enter a task before adding.");
    return;
  } else if (dueDate === "") {
    alert("Please select a due date.");
    return;
  } else if (taskDate.value < today) {
    alert("Please select today or a future date.");
    return;
  }

  const todoDetails = {
    id: Date.now(),
    taskdesc,
    isImportant,
    dueDate,
    complete: false,
  };

  if (isImportant) {
    todos.unshift(todoDetails);
  } else {
    todos.push(todoDetails);
  }

  localStorage.setItem("todoItem", JSON.stringify(todos));

  renderTodos();
  resetInputs();
}

addTaskBtn.addEventListener("click", addTodos);
// todos functionalty done

const dashboardGoals = document.querySelector("#dashboard-goals");
const goalInput = document.querySelector("#goal-input");
const goalDate = document.querySelector("#goal-date");
const goalEmptyMessage = document.querySelector(".goal-empty-message");
const goalList = document.querySelector(".goal-list");

const addGoal = document.querySelector("#add-goal-btn");
const totalGoalCount = document.querySelector(".total-goal-count");
const todayGoalCount = document.querySelector(".today-goal-count");

goalDate.min = today;
goalDate.setAttribute("min", today);

let goals = [];

// let totalGoals = goals.length;

// render Goals UI
function renderGoals() {
  if (goals.length === 0) {
    goalEmptyMessage.style.display = "flex";
  } else {
    goalEmptyMessage.style.display = "none";
  }

  let goalHTML = "";
  goalList.innerHTML = "";
  goals.forEach((goal) => {
    const formattedDate = new Date(goal.dueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    goalHTML += `<li class="goal-item">
    
                    <!-- Left -->

                    <div class="goal-left">

                      <!-- Task -->
                      
                      <input type="text" class="goal-title" value="${goal.goaldesc}" readonly>
                      
                      </div>
                      
                      <span class="goal-tag date-tag">
                      
                      <!-- <i class="ri-calendar-line"></i> -->
                      
                      ${formattedDate}

                      </span>
                      
                      <!-- Delete -->

                      <button class="goal-btn goal-delete-btn" title="Delete goal" data-id="${goal.id}">
                      
                      <i class="ri-delete-bin-line"></i>
                      
                      </button>
                      
                      
                      
                      </li>`;
  });
  totalGoalCount.innerHTML = goals.length;
  goalList.innerHTML = goalHTML;

  const todayGoals = goals.filter((goal) => {
    return goal.dueDate === today;
  });

  todayGoalCount.innerHTML = todayGoals.length;

  renderDashboardGoals();
}

// Render dashboard goals

function renderDashboardGoals() {
  dashboardGoals.innerHTML = "";
  const today = new Date().toLocaleDateString("en-CA");

  const todayGoals = goals.filter((item) => {
    return item.dueDate === today;
  });

  let dashboardGoalsItem = "";

  todayGoals.forEach((goal) => {
    dashboardGoalsItem += `<div class="dashboard-goal-items">
                  <span class="${goal.complete ? "completed-text" : ""}">${goal.goaldesc}</span>
                  <button class="goal-btn goal-complete-btn" title="Complete goal" data-id="${goal.id}">
                    <i class="ri-progress-5-line"></i>
                  </button>
                </div>`;
  });

  dashboardGoals.innerHTML = dashboardGoalsItem;
  updateStats(); // naya call add kiya
}

renderDashboardGoals();

// Add Goals funcitonalty
function addGoals() {
  const goaldesc = goalInput.value.trim();
  const dueDate = goalDate.value;

  if (goaldesc === "") {
    alert("Enter a task before adding.");
    return;
  } else if (dueDate === "") {
    alert("Please select a due date.");
    return;
  } else if (goalDate.value < today) {
    alert("Please select today or a future date.");
    return;
  }

  const goalsDetails = {
    id: Date.now(),
    goaldesc,
    dueDate,
    complete: false,
  };

  goals.push(goalsDetails);
  localStorage.setItem("goalItems", JSON.stringify(goals));

  renderGoals();
  resetInputs();
}
addGoal.addEventListener("click", addGoals);

// Goals delete functionalty

goalList.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".goal-delete-btn");

  if (!deleteBtn) return;

  const deletedId = Number(deleteBtn.dataset.id);

  goals = goals.filter((item) => {
    return item.id !== deletedId;
  });

  localStorage.setItem("goalItems", JSON.stringify(goals));
  renderGoals();
});

// goals section fully done

const plannerTabs = document.querySelectorAll(".planner-topbar span");
const customPlanner = document.querySelector("#custom-planner");
const fixedPlanner = document.querySelector("#fixed-planner");

const customPlannerContainer = document.querySelector(
  ".custom-planner-container",
);
const fixedPlannerContainer = document.querySelector(
  ".fixed-planner-container",
);

plannerTabs.forEach((tab) => {
  tab.addEventListener("click", function (event) {
    if (event.target.dataset.planner === "custom") {
      customPlannerContainer.style.display = "initial";
      fixedPlannerContainer.style.display = "none";
      customPlanner.classList.add("n-card");
      fixedPlanner.classList.remove("n-card");
    } else if (event.target.dataset.planner === "fixed") {
      customPlannerContainer.style.display = "none";
      fixedPlannerContainer.style.display = "flex";
      customPlanner.classList.remove("n-card");
      fixedPlanner.classList.add("n-card");
    }
  });
});

// Planner Input
const plannerInput = document.querySelector("#plan-input");
// Planner Date
const plannerDate = document.querySelector("#plan-date");

const plannerHour = document.querySelector("#plan-hour");
const plannerMinute = document.querySelector("#plan-minute");
const plannerPeriod = document.querySelector("#plan-period");

const addPlannerBtn = document.querySelector("#add-plan-btn");

const plannerList = document.querySelector(".planner-list");

const plannerEmptyMessage = document.querySelector(".planner-empty-message");

const planDate = document.querySelector("#plan-date");
const calendarIcon = document.querySelector(".plan-date i");

calendarIcon.addEventListener("click", () => {
  planDate.setAttribute("min", today);
  planDate.showPicker();
});

// Planner Array
let planners = [];

// Edit Planner
let editingPlannerId = null;

const fixedplanDate = document.querySelectorAll(".fixed-planner-date-input");
const fixedcalendarIcon = document.querySelectorAll(".fixed-planner-date i");

fixedcalendarIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    const dateInput = icon
      .closest(".fixed-planner-date")
      .querySelector(".fixed-planner-date-input");

    dateInput.min = today;
    dateInput.showPicker();
  });
});

const dashboardPlannerList = document.querySelector("#planner-list");

// render Dashboard Plans
function renderDashboardPlanner() {
  dashboardPlannerList.innerHTML = "";

  const today = new Date().toLocaleDateString("en-CA");

  const todayCustomPlans = planners
    .filter((item) => item.plansDate === today)
    .map((item) => ({
      id: item.id,
      time: `${item.plansHour}:${item.plansMintue}`,
      period: item.plansPeriod,
      task: item.plansDesc,
      type: "custom",
      complete: item.complete || false,
    }));

  const todayFixedPlans = fixedPlans
    .filter((item) => item.date === today)
    .map((item) => ({
      id: item.id,
      time: item.time,
      task: item.plan,
      type: "fixed",
      complete: item.complete || false,
    }));

  const allPlans = [...todayCustomPlans, ...todayFixedPlans];

  allPlans.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  let plannerHTML = "";

  allPlans.forEach((item) => {
    plannerHTML += `
      <li class="planner-item">
        <span class="planner-time">
          ${item.type === "fixed" ? formatTime(item.time) : `${item.time} ${item.period}`}
        </span>
        <span class="planner-task ${item.complete ? "completed-text" : ""}">
          ${item.task}
        </span>
        <button
          class="planner-complete-btn"
          title="Complete Planner"
          data-id="${item.id}"
          data-type="${item.type}"
        >
          <i class="ri-check-double-line"></i>
        </button>
      </li>
    `;
  });

  dashboardPlannerList.innerHTML = plannerHTML;
  updateStats(); // naya call add kiya
}
// planner UI renders
function renderPlans() {
  if (planners.length === 0) {
    plannerEmptyMessage.style.display = "flex";
  } else {
    plannerEmptyMessage.style.display = "none";
  }

  let plansHTML = "";

  planners.forEach((plans) => {
    const formattedDate = new Date(plans.plansDate).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );

    plansHTML += ` <div class="custom-plans-items">
                    <div class="plan-schedule">
                      <span id="hour">${plans.plansHour}</span>
                      <span id="column">:</span>
                      <span id="minute">${plans.plansMintue}</span>
                      <span id="period">${plans.plansPeriod}</span>
                    </div>
                    <span class="plan-desc">${plans.plansDesc}</span>
                    <span class="plan-date-tag">
                      ${formattedDate}
                    </span>
                    <!-- Delete -->

                    <button class="planner-btn delete-btn" title="Delete Task" data-id="${plans.id}">

                      <i class="ri-delete-bin-line"></i>

                    </button>
                  </div>`;
  });

  plannerList.innerHTML = plansHTML;

  renderDashboardPlanner();
}

// add planner functionalty
function addPlanners() {
  const plansDesc = plannerInput.value.trim();
  const plansDate = plannerDate.value;
  const plansHour = plannerHour.value;
  const plansMintue = plannerMinute.value;
  const plansPeriod = plannerPeriod.value;

  if (plansDesc === "") {
    alert("Write you plan's");
    return;
  } else if (plansDate === "") {
    alert("Please select due date.");
    return;
  } else if (plansHour === "" || plansMintue === "" || plansPeriod === "") {
    alert("Please Schedual your Plan's");
    return;
  }

  const planDetails = {
    id: Date.now(),
    plansDesc,
    plansDate,
    plansHour,
    plansMintue,
    plansPeriod,
  };

  planners.push(planDetails);

  localStorage.setItem("plansItem", JSON.stringify(planners));

  renderPlans();
  resetInputs();
}
addPlannerBtn.addEventListener("click", addPlanners);

// delete planner functionalty
plannerList.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".delete-btn");
  const deletedID = Number(deleteBtn.dataset.id);
  if (!deleteBtn) return;

  planners = planners.filter((item) => {
    return item.id !== deletedID;
  });

  localStorage.setItem("plansItem", JSON.stringify(planners));
  renderPlans();
});

const fixedPlannerInputs = document.querySelectorAll(".fixed-planner-input");
let fixedPlans = [];
let isDeleting = false;

// render fixed plan's UI
function renderFixedPlans() {
  fixedPlans.forEach((planItem) => {
    const plannerItem = document.querySelector(
      `.fixed-planner-item[data-time="${planItem.time}"]`,
    );

    if (!plannerItem) return;

    const plannerInput = plannerItem.querySelector(".fixed-planner-input");
    const plannerDate = plannerItem.querySelector(".fixed-planner-date-input");

    plannerInput.value = planItem.plan;
    plannerDate.value = planItem.date;
  });

  renderDashboardPlanner();
}

// delete button
fixedPlannerContainer.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".fixed-planner-delete-btn");

  if (!deleteBtn) return;

  isDeleting = true;

  const plannerItem = deleteBtn.closest(".fixed-planner-item");

  const plannerInput = plannerItem.querySelector(".fixed-planner-input");
  const plannerDate = plannerItem.querySelector(".fixed-planner-date-input");

  const time = plannerItem.dataset.time;

  // Clear UI
  plannerInput.value = "";
  plannerDate.value = "";

  // Remove from Array
  fixedPlans = fixedPlans.filter((item) => {
    return item.time !== time;
  });

  // Update LocalStorage
  localStorage.setItem("fixedPlans", JSON.stringify(fixedPlans));

  isDeleting = false;

  renderDashboardPlanner();
});

// time format function
function formatTime(time) {
  let [hour, minute] = time.split(":");

  hour = Number(hour);

  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;

  if (hour === 0) {
    hour = 12;
  }

  return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
}

// data lload in UI
function saveFixedPlan(input) {
  const inputItem = input.closest(".fixed-planner-item");
  const time = inputItem.dataset.time;
  const plan = input.value.trim();
  const date = inputItem.querySelector(".fixed-planner-date-input").value;

  if (plan === "" && date === "") return;

  const existingPlan = fixedPlans.find((item) => item.time === time);

  if (existingPlan) {
    existingPlan.plan = plan;
    existingPlan.date = date;
  } else {
    const fixedPlanDetails = {
      id: Date.now(),
      time,
      plan,
      date,
      complete: false, // naya field
    };
    fixedPlans.push(fixedPlanDetails);
  }

  localStorage.setItem("fixedPlans", JSON.stringify(fixedPlans));
  renderDashboardPlanner();
}

fixedPlannerInputs.forEach((input) => {
  const plannerItem = input.closest(".fixed-planner-item");
  const dateInput = plannerItem.querySelector(".fixed-planner-date-input");

  // Start Editing
  input.addEventListener("focus", function () {
    input.readOnly = false;
  });

  // Save on Blur
  input.addEventListener("blur", function () {
    input.readOnly = true;

    if (isDeleting) return;

    saveFixedPlan(input);
  });

  // Save on Date Change
  dateInput.addEventListener("change", function () {
    saveFixedPlan(input);
  });
});

// empty localstorage pagload function
// ================= Stats Counter =================

function updateStats() {
  const today = new Date().toLocaleDateString("en-CA");

  // ---- Todos ----
  const todayTodos = todos.filter((t) => t.dueDate === today);
  const completedTodayTodos = todayTodos.filter((t) => t.complete);

  document.getElementById("todo-today-count").textContent = todayTodos.length;
  document.getElementById("todo-completed-count").textContent = completedTodayTodos.length;

  // ---- Goals ----
  const todayGoals = goals.filter((g) => g.dueDate === today);
  const completedTodayGoals = todayGoals.filter((g) => g.complete);

  document.getElementById("goal-today-count").textContent = todayGoals.length;
  document.getElementById("goal-completed-count").textContent = completedTodayGoals.length;

  // ---- Events (Planner: custom + fixed dono) ----
  const todayCustomPlans = planners.filter((p) => p.plansDate === today);
  const todayFixedPlans = fixedPlans.filter((p) => p.date === today);

  const totalTodayEvents = todayCustomPlans.length + todayFixedPlans.length;
  const completedTodayEvents =
    todayCustomPlans.filter((p) => p.complete).length +
    todayFixedPlans.filter((p) => p.complete).length;

  document.getElementById("event-today-count").textContent = totalTodayEvents;
  document.getElementById("event-completed-count").textContent = completedTodayEvents;
}

// ================= Complete Button Handlers =================

// Todo complete toggle (dashboard)
dashboardTodos.addEventListener("click", function (event) {
  const completeBtn = event.target.closest(".todos-complete-btn");
  if (!completeBtn) return;

  const id = Number(completeBtn.dataset.id);
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;

  todo.complete = !todo.complete;
  localStorage.setItem("todoItem", JSON.stringify(todos));
  renderDashboardTodos();
});

// Goal complete toggle (dashboard)
dashboardGoals.addEventListener("click", function (event) {
  const completeBtn = event.target.closest(".goal-complete-btn");
  if (!completeBtn) return;

  const id = Number(completeBtn.dataset.id);
  const goal = goals.find((item) => item.id === id);
  if (!goal) return;

  goal.complete = !goal.complete;
  localStorage.setItem("goalItems", JSON.stringify(goals));
  renderDashboardGoals();
});

// Planner complete toggle (custom + fixed dono, dashboard)
dashboardPlannerList.addEventListener("click", function (event) {
  const completeBtn = event.target.closest(".planner-complete-btn");
  if (!completeBtn) return;

  const id = Number(completeBtn.dataset.id);
  const type = completeBtn.dataset.type;

  if (type === "custom") {
    const plan = planners.find((item) => item.id === id);
    if (!plan) return;
    plan.complete = !plan.complete;
    localStorage.setItem("plansItem", JSON.stringify(planners));
  } else if (type === "fixed") {
    const plan = fixedPlans.find((item) => item.id === id);
    if (!plan) return;
    plan.complete = !plan.complete;
    localStorage.setItem("fixedPlans", JSON.stringify(fixedPlans));
  }

  renderDashboardPlanner();
});
loadTodosFromStorage();

// specifict timer tabs pomodoro

// Display
const fixedTimerDisplay = document.querySelector("#fixed-timer-display");
const fixedTimerLabel = document.querySelector("#fixed-timer-label");

// Circle
const fixedTimerProgress = document.querySelector("#fixed-timer-progress");

// Buttons
const fixedStartBtn = document.querySelector("#fixed-start-btn");
const fixedPauseBtn = document.querySelector("#fixed-pause-btn");
const fixedResetBtn = document.querySelector("#fixed-reset-btn");
const fixedSessionType = document.querySelector("#fixed-session-type");


fixedSessionType.addEventListener("change", function () {

  localStorage.setItem(
    "fixedSessionType",
    fixedSessionType.value
  );

});

function loadFixedSession() {

  const savedSession = localStorage.getItem("fixedSessionType");

  if (savedSession) {
    fixedSessionType.value = savedSession;
  }

}

const FIXED_POMODORO_TIME = 25 * 60; // 25 Minutes

const FIXED_RADIUS = fixedTimerProgress.r.baseVal.value;
const FIXED_CIRCUMFERENCE = 2 * Math.PI * FIXED_RADIUS;377;

let fixedTimeLeft = FIXED_POMODORO_TIME;

let fixedTimer = null;

let fixedIsRunning = false;

// Total focus today (Seconds)
let fixedTotalFocusToday = 0;

// End timestamp
let fixedEndTime = null;

const FIXED_TIMER_KEY = "fixedPomodoro";
const FIXED_FOCUS_KEY = "fixedFocusTime";

function updateFixedDisplay() {
  const minutes = Math.floor(fixedTimeLeft / 60);

  const seconds = fixedTimeLeft % 60;

  fixedTimerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateFixedProgress() {

    const progress = fixedTimeLeft / FIXED_POMODORO_TIME;

    const offset = FIXED_CIRCUMFERENCE * (1 - progress);

    fixedTimerProgress.style.strokeDasharray = FIXED_CIRCUMFERENCE;

    fixedTimerProgress.style.strokeDashoffset = offset;

}

function saveFixedPomodoro() {
  const timerData = {
    timeLeft: fixedTimeLeft,

    isRunning: fixedIsRunning,

    endTime: fixedEndTime,
  };

  localStorage.setItem(FIXED_TIMER_KEY, JSON.stringify(timerData));
}

function loadFixedPomodoro() {
  const storedTimer = localStorage.getItem(FIXED_TIMER_KEY);

  if (!storedTimer) return;

  const timerData = JSON.parse(storedTimer);

  fixedTimeLeft = timerData.timeLeft;

  fixedIsRunning = timerData.isRunning;

  fixedEndTime = timerData.endTime;
}

function saveFocusTime() {
  const today = new Date().toLocaleDateString("en-CA");

  const data = {
    date: today,

    total: fixedTotalFocusToday,
  };

  localStorage.setItem(FIXED_FOCUS_KEY, JSON.stringify(data));
}

function loadFocusTime() {
  const stored = localStorage.getItem(FIXED_FOCUS_KEY);

  if (!stored) return;

  const data = JSON.parse(stored);

  const today = new Date().toLocaleDateString("en-CA");

  if (data.date === today) {
    fixedTotalFocusToday = data.total;
  } else {
    fixedTotalFocusToday = 0;

    saveFocusTime();
  }
}

function checkDailyReset() {
  const stored = localStorage.getItem(FIXED_FOCUS_KEY);

  if (!stored) return;

  const data = JSON.parse(stored);

  const today = new Date().toLocaleDateString("en-CA");

  if (today !== data.date) {
    fixedTotalFocusToday = 0;

    saveFocusTime();
  }
}

loadFixedPomodoro();

loadFocusTime();

checkDailyReset();

loadFixedSession();

updateFixedDisplay();

updateFixedProgress();


function resumeFixedPomodoro() {

    if (!fixedIsRunning || !fixedEndTime) return;

    const remainingSeconds = Math.floor(
        (fixedEndTime - Date.now()) / 1000
    );

    // Timer already finished
    if (remainingSeconds <= 0) {

        fixedTimeLeft = 0;

        updateFixedDisplay();

        updateFixedProgress();

        fixedIsRunning = false;

        // fixedTimerLabel.textContent = "Completed 🎉";

        localStorage.removeItem(FIXED_TIMER_KEY);

        return;

    }

    fixedTimeLeft = remainingSeconds;

    updateFixedDisplay();

    updateFixedProgress();

    runFixedTimer();

}


function runFixedTimer() {

    clearInterval(fixedTimer);

    fixedTimer = setInterval(() => {

        fixedTimeLeft--;


        fixedTotalFocusToday++;

        updateFixedDisplay();

        updateFixedProgress();

        saveFocusTime();

        saveFixedPomodoro();

        // Timer Finished
        if (fixedTimeLeft <= 0) {

            clearInterval(fixedTimer);

            fixedIsRunning = false;

            fixedTimeLeft = 0;

            fixedTimerLabel.textContent = "Completed 🎉";

            updateFixedDisplay();

            updateFixedProgress();

            localStorage.removeItem(FIXED_TIMER_KEY);

        }

    }, 1000);

}


function startFixedPomodoro() {

    if (fixedIsRunning) return;

    fixedIsRunning = true;

    // fixedTimerLabel.textContent = "Focus Time";

    fixedEndTime =
        Date.now() + fixedTimeLeft * 1000;

    saveFixedPomodoro();

    runFixedTimer();

}

function pauseFixedPomodoro() {

    clearInterval(fixedTimer);

    fixedIsRunning = false;

    fixedEndTime = null;

    saveFixedPomodoro();

}


function resetFixedPomodoro() {

    clearInterval(fixedTimer);

    fixedIsRunning = false;

    fixedTimeLeft = FIXED_POMODORO_TIME;

    fixedEndTime = null;

    updateFixedDisplay();

    updateFixedProgress();

    saveFixedPomodoro();

}


resumeFixedPomodoro();


fixedStartBtn.addEventListener("click", () => {

    startFixedPomodoro();

});



fixedPauseBtn.addEventListener("click", () => {

    pauseFixedPomodoro();

});



fixedResetBtn.addEventListener("click", () => {

    resetFixedPomodoro();

});


updateFixedDisplay();

updateFixedProgress();


function getTodayFocusTime() {

    const hours = Math.floor(fixedTotalFocusToday / 3600);

    const minutes = Math.floor((fixedTotalFocusToday % 3600) / 60);

    const seconds = fixedTotalFocusToday % 60;

    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

}
// weather code functionalty

// ================= Weather Tab - Dynamic JS =================

const weatherTab = {
  latitude: 23.2599,   // default: Bhopal
  longitude: 77.4126,
  locationName: "Bhopal",

  elements: {
    searchInput: document.getElementById("weather-tab-search-input"),
    searchBtn: document.getElementById("weather-tab-search-btn"),
    refreshBtn: document.getElementById("weather-tab-refresh-btn"),
    location: document.getElementById("weather-tab-location"),
    temp: document.getElementById("weather-tab-temp"),
    condition: document.getElementById("weather-tab-condition"),
    humidity: document.getElementById("weather-tab-humidity"),
    wind: document.getElementById("weather-tab-wind"),
    feels: document.getElementById("weather-tab-feels"),
    pressure: document.getElementById("weather-tab-pressure"),
    sunrise: document.getElementById("weather-tab-sunrise-time"),
    sunset: document.getElementById("weather-tab-sunset-time"),
  },

  // WMO weather codes -> readable text
  weatherCodeMap: {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime Fog",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Rain",
    65: "Heavy Rain",
    71: "Slight Snow",
    73: "Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Violent Rain Showers",
    95: "Thunderstorm",
    96: "Thunderstorm w/ Hail",
    99: "Thunderstorm w/ Hail",
  },

  init() {
    this.elements.searchBtn.addEventListener("click", () => this.handleSearch());
    this.elements.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });
    this.elements.refreshBtn.addEventListener("click", () => this.fetchWeather());

    this.fetchWeather();
  },

  async handleSearch() {
    const query = this.elements.searchInput.value.trim();
    if (!query) return;

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        this.elements.condition.textContent = "Location not found";
        return;
      }

      const place = geoData.results[0];
      this.latitude = place.latitude;
      this.longitude = place.longitude;
      this.locationName = place.name;

      this.elements.searchInput.value = "";
      this.fetchWeather();
    } catch (err) {
      console.error("Geocoding error:", err);
      this.elements.condition.textContent = "Search failed";
    }
  },

  async fetchWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,weather_code&daily=sunrise,sunset&timezone=auto`;

      const res = await fetch(url);
      const data = await res.json();

      this.renderWeather(data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      this.elements.condition.textContent = "Failed to load weather";
    }
  },

  renderWeather(data) {
    const current = data.current;
    const daily = data.daily;

    this.elements.location.textContent = `📍 ${this.locationName}`;
    this.elements.temp.textContent = `${Math.round(current.temperature_2m)}°C`;
    this.elements.condition.textContent =
      this.weatherCodeMap[current.weather_code] || "Unknown";

    this.elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    this.elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    this.elements.feels.textContent = `${Math.round(current.apparent_temperature)}°C`;
    this.elements.pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;

    this.elements.sunrise.textContent = this.formatTime(daily.sunrise[0]);
    this.elements.sunset.textContent = this.formatTime(daily.sunset[0]);
  },

  formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  },
};

document.addEventListener("DOMContentLoaded", () => weatherTab.init());












// Quote tabs funcionalty 

const quoteTabText = document.querySelector("#quote-tab-text");
const quoteTabAuthor = document.querySelector("#quote-tab-author");
const quoteTabRefreshBtn = document.querySelector("#quote-tab-new-btn");

async function updateTabQuote() {
  const response = await fetch("https://dummyjson.com/quotes/random");

  const data = await response.json();

  quoteTabText.textContent = data.quote;

  quoteTabAuthor.textContent = data.author;
}
updateQuote();
quoteTabRefreshBtn.addEventListener("click", updateTabQuote);


