const body = document.querySelector("body");
const themeChange = document.querySelector("#theme-select");
const themeOptions = document.querySelector("#theme-select option");
const themeVideo = document.querySelector("#theme-video");

const greeting = document.querySelector("#greeting-name");
localStorage.getItem("greetings", greeting);

function greetings() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "morning") {
    greeting.textContent = "Good Morning ";
  } else if (savedTheme === "day") {
    greeting.textContent = "Good Afternoon ";
  } else if (savedTheme === "evening") {
    greeting.textContent = "Good Evening ";
  } else if (savedTheme === "night") {
    greeting.textContent = "Good Night";
  }
}
greetings();
// greetings functions

themeChange.addEventListener("change", function () {
  localStorage.setItem("theme", this.value);

  const savedTheme = localStorage.getItem("theme");

  console.log(savedTheme);

  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    themeVideo.setAttribute("src", `assets/${savedTheme}-wheather-video.mp4`);
    themeChange.value = savedTheme;
  }
  greetings();
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    themeVideo.setAttribute("src", `assets/${savedTheme}-wheather-video.mp4`);
    themeChange.value = savedTheme;
  greetings();
}
// Theme Changing JS Done


const themeToggleBtn = document.querySelector("#theme-toggle-card");

themeToggleBtn.addEventListener("click", function(){
    body.setAttribute("data-theme" ,"night");
    themeVideo.setAttribute("src", `assets/nightu-wheather-video.mp4`)
})







const quotes = [
  {
    quote: "Success is built in silence long before it is seen in public.",
    author: "— Naval Ravikant",
  },
  {
    quote:
      "The person who can stay focused while others are distracted will own the future.",
    author: "— James Clear",
  },
  {
    quote:
      "Discipline is choosing between what you want now and what you want most.",
    author: "— Abraham Lincoln",
  },
  {
    quote: "Your comfort zone is the most expensive place to live.",
    author: "— Alex Hormozi",
  },
  {
    quote: "Small daily improvements create extraordinary results over time.",
    author: "— Robin Sharma",
  },
  {
    quote:
      "The hardest worker in the room eventually becomes the most valuable.",
    author: "— Patrick Bet-David",
  },
  {
    quote: "Talent opens the door, consistency keeps it open.",
    author: "— Angela Duckworth",
  },
  {
    quote: "The future rewards those who can delay gratification today.",
    author: "— Morgan Housel",
  },
  {
    quote: "Most people quit when they are one breakthrough away from success.",
    author: "— Les Brown",
  },
  {
    quote: "Your habits are the architects of your destiny.",
    author: "— James Clear",
  },
  {
    quote: "Dreams become reality only when action becomes a daily ritual.",
    author: "— Denzel Washington",
  },
  {
    quote: "You do not rise to your goals, you fall to your systems.",
    author: "— James Clear",
  },
  {
    quote: "Every expert was once a beginner who refused to quit.",
    author: "— Helen Hayes",
  },
  {
    quote: "A year from now you will wish you had started today.",
    author: "— Karen Lamb",
  },
  {
    quote: "Focus is a superpower in a world designed to distract you.",
    author: "— Cal Newport",
  },
  {
    quote: "Your current situation is not your final destination.",
    author: "— Nido Qubein",
  },
  {
    quote: "What feels impossible today becomes your warm-up tomorrow.",
    author: "— David Goggins",
  },
  {
    quote:
      "The quality of your future depends on what you repeatedly do today.",
    author: "— Brian Tracy",
  },
  {
    quote: "My Internal Wealth Will Definitely Create My External Wealth...",
    author: "— Farhan Khan",
  },
];

const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteRefreshBtn = document.querySelector("#new-quote-btn");

function updateQuote() {
  let randomQuoteIdx = Math.floor(Math.random() * quotes.length + 1);

  quoteText.textContent = quotes[randomQuoteIdx].quote;
  quoteAuthor.textContent = quotes[randomQuoteIdx].author;
}
updateQuote();
quoteRefreshBtn.addEventListener("click", updateQuote);

// Quote Chaning JS Done
