// Initialize Choices.js with the class name
const categoryDropdown = new Choices("#category", {
  searchEnabled: false,
sorter: (a, b) => {
    if (a.value === "any") {
      return -1; // "any" comes first
    } else if (b.value === "any") {
      return 1; // "any" comes first
    } else {
      // Sort the other categories alphabetically
      return a.label.localeCompare(b.label);
    }
  },
  itemSelectText: "",
  classNames: {
    containerInner: "custom-dropdown",
    containerOuter: "custom-choices",
    input: "choices__input",
    inputCloned: "choices__input--cloned",
    list: "choices__list",
    listItems: "choices__list--multiple",
    listSingle: "choices__list--single",
    listDropdown: "choices__list--dropdown",
    item: "option-el",
    itemSelectable: "choices__item--selectable",
    itemDisabled: "choices__item--disabled",
    itemOption: "choices__item--choice",
    group: "choices__group",
    groupHeading: "choices__heading",
    button: "choices__button",
    activeState: "is-active",
    focusState: "is-focused",
    openState: "is-open",
    disabledState: "is-disabled",
    highlightedState: "is-highlighted",
    selectedState: "is-selected",
    flippedState: "is-flipped",
    selectedState: "is-highlighted",
  },
  allowHTML: true,
});

const difficultyDropdown = new Choices("#difficulty", {
  searchEnabled: false,
  shouldSort: false,
  shouldSortItems: false,
  itemSelectText: "",
  classNames: {
    containerInner: "custom-dropdown",
    containerOuter: "custom-choices",
    input: "choices__input",
    inputCloned: "choices__input--cloned",
    list: "choices__list",
    listItems: "choices__list--multiple",
    listSingle: "choices__list--single",
    listDropdown: "choices__list--dropdown",
    item: "option-el",
    itemSelectable: "choices__item--selectable",
    itemDisabled: "choices__item--disabled",
    itemOption: "choices__item--choice",
    group: "choices__group",
    groupHeading: "choices__heading",
    button: "choices__button",
    activeState: "is-active",
    focusState: "is-focused",
    openState: "is-open",
    disabledState: "is-disabled",
    highlightedState: "is-highlighted",
    selectedState: "is-selected",
    flippedState: "is-flipped",
    selectedState: "is-highlighted",
  },
  sorter: (a, b) => {
    const order = { any: 1, easy: 2, medium: 3, hard: 4 };
    return order[a.value] - order[b.value];
  },
  allowHTML: true,
});

let currentQuestionIndex;
let questions;
let userScore;
let isAnsweringAllowed; // Flag to control answering during question loading
const quizContainer = document.getElementById("quizContainer");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const quitButton = document.getElementById("quitButton");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progressBar");
const startButtonLanding = document.getElementById("startButtonLanding");
const landingPage = document.getElementById("landingPage");
const quizSection = document.getElementById("quizSection");

startButtonLanding.addEventListener("click", () => {
  landingPage.style.display = "none";
  quizSection.style.display = "flex";
  initializeGameState();
});
startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", initializeGameState);
quitButton.addEventListener("click", quitGame);
progressBar.style.display = "none";

function initializeGameState() {
  currentQuestionIndex = 0;
  questions = null;
  userScore = 0;
  progressBar.value = 0;
  isAnsweringAllowed = false;
  startButton.style.display = "block";
  document.getElementById("categoryContainer").style.display = "block";
  document.getElementById("difficultyContainer").style.display = "block";
  categorySelect.value = "any";
  difficultySelect.value = "any";
  categorySelect.disabled = false;
  difficultySelect.disabled = false;
  playAgainButton.style.display = "none";
  quizContainer.innerHTML = "";
  quizContainer.style.display = "none";
}

function startGame() {
  document.getElementById("categoryContainer").style.display = "none";
  document.getElementById("difficultyContainer").style.display = "none";
  startButton.style.display = "none";
  progressBar.style.display = "block";
  loader.style.display = "block";
  quizContainer.style.display = "block";
  // Get selected category and difficulty
  const selectedCategory = categorySelect.value;
  const selectedDifficulty = difficultySelect.value;

  categorySelect.disabled = true;
  difficultySelect.disabled = true;

  // Check if the user has made a selection
  if (selectedCategory !== "any" && selectedDifficulty !== "any") {
    // Construct the API URL with the selected category and difficulty
    let apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}`;
    userScore = 0;
    progressBar.value = 0;
    const answerList = document.getElementById("answerList");
    if (answerList) {
      answerList.innerHTML = ""; // Clear answer options
      answerList.style.pointerEvents = "none"; // Disable answer options during fetch
    }

    isAnsweringAllowed = false; // Set answering flag to false during question loading

    fetchQuestions(apiUrl);
  } else {
    let apiUrl = "https://opentdb.com/api.php?amount=10";

    fetchQuestions(apiUrl);
  }
  quitButton.style.display = "block";
}

const fetchQuestions = (apiUrl) => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      questions = data.results;
      if (questions && questions.length > 0) {
        isAnsweringAllowed = true; // Set answering flag to true after questions are loaded
        displayQuestion();
      } else {
        console.error("No questions loaded.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      console.error("Failed to load questions. Retrying...");
    })
    .finally(() => {
      loader.style.display = "none";
      const answerList = document.getElementById("answerList");
      if (answerList) {
        answerList.style.pointerEvents = "auto"; // Enable answer options after fetch (success or failure)
      }
    });
};

function displayQuestion() {
  if (isAnsweringAllowed) {
    // Check if answering is allowed before displaying the question
    const question = questions[currentQuestionIndex];
    const questionElement = document.createElement("div");
    // Display selected category and difficulty if available
    const categoryDifficultyText = `<p>Category: ${question.category}, Difficulty: ${question.difficulty}</p>`;
    questionElement.innerHTML = `
    ${categoryDifficultyText}

      <p>${question.question}</p>
      <ul id="answerList">
        ${shuffleArray([...question.incorrect_answers, question.correct_answer])
          .map((answer) => `<li>${answer}</li>`)
          .join("")}
      </ul>
    `;
    quizContainer.innerHTML = "";
    quizContainer.appendChild(questionElement);

    const answerList = document.getElementById("answerList");
    answerList.addEventListener("click", handleAnswer);
    progressBar.value = currentQuestionIndex;
  }
}

function handleAnswer(event) {
  if (isAnsweringAllowed && event.target.tagName === "LI") {
    const selectedAnswer = event.target.textContent;
    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    const isCorrect = selectedAnswer === correctAnswer;

    const feedbackMessage = isCorrect
      ? "Correct!"
      : `Incorrect. The correct answer is: ${correctAnswer}`;
    displayFeedback(feedbackMessage);
    // Update the user's score
    if (isCorrect) {
      userScore++;
    }
  }
}

function displayFeedback(message) {
  const feedbackElement = document.createElement("p");
  feedbackElement.textContent = message;
  feedbackElement.style.color = "black"; // Set font color to black for visibility

  // Clear the existing feedback elements
  quizContainer.innerHTML = "";

  // Append the new feedback element
  quizContainer.appendChild(feedbackElement);

  // Delay the removal of the feedback element until the next question is displayed
  setTimeout(() => {
    feedbackElement.remove();

    // Move to the next question or end the quiz after removing the feedback
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
      displayQuestion();
    } else {
      endGame();
    }
  }, 3000); // Adjust the delay as needed
}

function endGame() {
  quizContainer.innerHTML += `<p>Quiz completed! Your score is ${userScore}/10.</p>`;
  progressBar.style.display = "none";
  playAgainButton.style.display = "block";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function quitGame() {
  quizContainer.innerHTML = "<p>Game quit. Better luck next time!</p>";
  progressBar.style.display = "none";
  quitButton.style.display = "none"
  setTimeout(() => {
    quizContainer.innerHTML = "";
    initializeGameState();
  }, 3000);
}
