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
const todoDashboard = document.querySelector("#todo-main");
const goalDashboard = document.querySelector("#goal-main");
const plannerDashboard = document.querySelector("#planner-main");

const navTabs = document.querySelectorAll(".nav-menu .nav-item");

navTabs.forEach((link) => {
  link.addEventListener("click", function () {
    dashboard.style.display = "none";
    todoDashboard.style.display = "none";
    goalDashboard.style.display = "none";
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
      alert(
        "Please use either the Fixed Planner or the Custom Planner, not both at the same time.",
      );
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
                  <span>${todo.taskdesc}</span>
                  <div class="dashboard-todo-tags">
                    ${
                      todo.isImportant
                        ? `<span class="dashboard-important-tag">
                      <i class="ri-star-fill"></i>
                    </span>`
                        : ""
                    }
                  <button class="todos-complete-btn" title="Complete Task">
                    <i class="ri-check-double-line"></i>
                  </button>
                  </div>
                </div>`;
  });

  dashboardTodos.innerHTML = dashboardTodoItem;
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

const dashboardGolas = document.querySelector("#dashboard-goals");
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

                      <button class="goal-btn gaol-delete-btn" title="Delete goal" data-id="${goal.id}">
                      
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
  dashboardGolas.innerHTML = "";
  const today = new Date().toLocaleDateString("en-CA");

  const todayGoals = goals.filter((item) => {
    return item.dueDate === today;
  });

  let dashboardGoalsItem = "";

  todayGoals.forEach((goal) => {
    dashboardGoalsItem += `<div class="dashboard-goal-items">
                  <span>${goal.goaldesc}</span>
                  <!-- Complete goals button  -->
                  <button class="goal-btn goal-complete-btn" title="Complete goal" data-id="${goal.id}">
                    <i class="ri-progress-5-line"></i>
                  </button>
                </div>`;
  });

  dashboardGolas.innerHTML = dashboardGoalsItem;
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
  const deleteBtn = event.target.closest(".gaol-delete-btn");

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

function loadFixedPlans() {
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
}

// delete function for Fixed plan's

const fixedPlannerList = document.querySelectorAll(".fixedPlannerList");

const fixedPlanDeleteBtn = document.querySelectorAll(
  ".fixed-planner-delete-btn",
);

fixedPlannerContainer.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".fixed-planner-delete-btn");

  if (!deleteBtn) return;

  const plannerItem = deleteBtn.closest(".fixed-planner-item");
  const plan = plannerItem.querySelector(".fixed-planner-input")
  const date = plannerItem.querySelector(".fixed-planner-date-input");

  console.log(plannerItem)
  console.log(plan)
  console.log(date)

});

// Save Function
function saveFixedPlan(input) {
  const inputItem = input.closest(".fixed-planner-item");

  const time = inputItem.dataset.time;
  const plan = input.value;
  const date = inputItem.querySelector(".fixed-planner-date-input").value;

  const existingPlan = fixedPlans.find((item) => {
    return item.time === time;
  });

  if (existingPlan) {
    existingPlan.plan = plan;
    existingPlan.date = date;
  } else {
    const fixedPlanDetails = {
      id: Date.now(),
      time,
      plan,
      date,
    };

    fixedPlans.push(fixedPlanDetails);
  }

  localStorage.setItem("fixedPlans", JSON.stringify(fixedPlans));
}

// Events
fixedPlannerInputs.forEach((input) => {
  const inputItem = input.closest(".fixed-planner-item");
  const dateInput = inputItem.querySelector(".fixed-planner-date-input");

  // Edit Start
  input.addEventListener("focus", function () {
    input.readOnly = false;
  });

  // Save on Input Blur
  input.addEventListener("blur", function () {
    input.readOnly = true;
    saveFixedPlan(input);
  });

  // Save on Date Change
  dateInput.addEventListener("change", function () {
    saveFixedPlan(input);
  });
});

// empty localstorage pagload function
function loadTodosFromStorage() {
  const storedTodo = localStorage.getItem("todoItem");
  const storedGoal = localStorage.getItem("goalItems");
  const storePlans = localStorage.getItem("plansItem");
  const FixedPlans = localStorage.getItem("fixedPlans");

  if (storedTodo) {
    todos = JSON.parse(storedTodo);
  }

  if (storedGoal) {
    goals = JSON.parse(storedGoal);
  }

  if (storePlans) {
    planners = JSON.parse(storePlans);
  }

  if (FixedPlans) {
    fixedPlans = JSON.parse(FixedPlans);
  }

  renderTodos();
  renderGoals();
  renderPlans();
  loadFixedPlans();
}
loadTodosFromStorage();
