let questions;
let currentQuestionIndex = 0;
let userScore = 0;
let isAnsweringAllowed = false;
const quizContainer = document.getElementById("quizContainer");
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);
startButton.addEventListener("click", startGame);
function startGame() {
  console.log("startGame function is being executed.");

  // Check if the game is already in progress
  if (isAnsweringAllowed) {
    // If the game is in progress, reset the game state
    currentQuestionIndex = 0;
    questions = null;
        userScore = 0;
    isAnsweringAllowed = false;
  }

  // Construct the API URL
  let apiUrl = "https://opentdb.com/api.php?amount=10";

  fetchQuestions(apiUrl);
}

const fetchQuestions = (apiUrl) => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      if (questions && questions.length > 0) {
        isAnsweringAllowed = true;
        displayQuestion();
      } else {
        console.error("No questions loaded.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      console.error("Failed to load questions. Retrying...");
    });
};


function displayQuestion() {
    const questionElement = document.createElement("div");
    questionElement.innerHTML = `<p>${questions[currentQuestionIndex].question}</p>`;
    quizContainer.innerHTML = "";
    quizContainer.appendChild(questionElement);
}
