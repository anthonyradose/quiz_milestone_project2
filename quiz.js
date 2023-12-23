/* globals Choices */
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
  },
  sorter: (a, b) => {
    const order = { any: 1, easy: 2, medium: 3, hard: 4 };
    return order[a.value] - order[b.value];
  },
  allowHTML: true,
});

// State Variables:
let currentQuestionIndex;
let questions;
let userScore;
let isAnsweringAllowed; // Flag to control answering during question loading

// Elements:
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
const categoryContainer = document.getElementById("categoryContainer");
const difficultyContainer = document.getElementById("difficultyContainer");

// Event Listeners:
startButtonLanding.addEventListener("click", () => {
  landingPage.style.display = "none";
  quizSection.style.display = "flex";
  initializeGameState();
});
startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", initializeGameState);
quitButton.addEventListener("click", quitGame);
progressBar.style.display = "none";

// Initialization:
function initializeGameState() {
  currentQuestionIndex = 0;
  questions = null;
  userScore = 0;
  progressBar.value = 0;
  isAnsweringAllowed = false;
  startButton.style.display = "block";
  categoryContainer.style.display = "block";
  difficultyContainer.style.display = "block";
  categorySelect.value = "any";
  difficultySelect.value = "any";
  categoryDropdown.setChoiceByValue("any");
  difficultyDropdown.setChoiceByValue("any");
  categorySelect.disabled = false;
  difficultySelect.disabled = false;
  playAgainButton.style.display = "none";
  quitButton.style.display = "none";
  quizContainer.innerHTML = "";
  quizContainer.style.display = "none";
}

// UI Functions:
function hideStartElements() {
  categoryContainer.style.display = "none";
  difficultyContainer.style.display = "none";
  startButton.style.display = "none";
}
function displayLoader(showLoader = true) {
  loader.style.display = showLoader ? "block" : "none";
  if (showLoader) {
    setTimeout(() => {
      quizContainer.style.display = "block";
      quizContainer.style.backgroundColor = "transparent";
    }, 100); // Adjust the delay as needed
  } else {
    quizContainer.style.display = "block";
    quizContainer.style.backgroundColor = "transparent";
  }
}

function displayErrorMessage(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.remove();
  }

  const newErrorDiv = document.createElement("div");
  newErrorDiv.id = "error-message";
  newErrorDiv.style.backgroundColor = "lightblue";
  newErrorDiv.style.padding = "10px";
  newErrorDiv.style.border = "1px solid blue";
  newErrorDiv.style.position = "absolute";
  newErrorDiv.style.top = "70%";
  newErrorDiv.style.left = "50%";
  newErrorDiv.style.transform = "translate(-50%, -50%)";
  newErrorDiv.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(newErrorDiv);
}

// Game Functions:
function startGame() {
  hideStartElements();
  displayLoader();
  const apiUrl = buildApiUrlBasedOnSelection();
  fetchQuestions(apiUrl);
}
function endGame() {
  let icon;

  if (userScore >= 7 && userScore <= 10) {
    icon = `<img src="./assets/icons/trophy.svg" alt="Trophy Icon">`; // Trophy icon for high scores
  } else if (userScore >= 4 && userScore <= 6) {
    icon =     icon = `<img src="./assets/icons/neutral-face.svg" alt="Neutral Icon">`; // Star icon for medium scores

  } else {
    icon =     icon = `<img src="./assets/icons/broken-heart.svg" alt="Heart Icon">`; // Star icon for medium scores
  }
  quizContainer.innerHTML += `<p>Quiz completed! Your score is ${userScore}/10 ${icon}.</p>`;
  quizContainer.style.backgroundColor = "lightblue";

  progressBar.style.display = "none";
  playAgainButton.style.display = "block";
}
function quitGame() {
  progressBar.style.display = "none";
  quitButton.style.display = "none";
  quizContainer.innerHTML = "<p>Game quit. Better luck next time!</p>";
  quizContainer.style.backgroundColor = "lightblue";

  setTimeout(() => {
    quizContainer.innerHTML = "";
    initializeGameState();
  }, 1000);
}

// API Functions:
function fetchQuestions(apiUrl, retryCount = 3, retryDelay = 3000) {
  const retry = (count) => {
    if (count > 0) {
      setTimeout(() => {
        console.log(`Retrying... (Attempts left: ${count})`);
        fetchQuestions(apiUrl, count - 1, retryDelay);
      }, retryDelay);
    } else {
      console.error("Max retries reached. Could not fetch questions.");
      displayErrorMessage(
        "Sorry, there was an issue fetching questions. Please try again later."
      );
      loader.style.display = "none";
    }
  };

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      questions = data.results;

      if (questions && questions.length > 0) {
        isAnsweringAllowed = true; // Set answering flag to true after questions are loaded
        displayQuestion();
      } else {
        console.error("No questions loaded.");
        retry(retryCount);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (error.response) {
        console.error("HTTP Status Code:", error.response.status);
        quizSection.innerHTML = `<p class="error-message">HTTP Status Code: ${error.response.status}</p>`;
      }
      console.error("Failed to load questions.");
      retry(retryCount);
    })
    .finally(() => {
      const answerListFetchQuestions = document.getElementById("answerList");
      if (answerListFetchQuestions) {
        answerListFetchQuestions.style.pointerEvents = "auto"; // Enable answer options after fetch (success or failure)
      }

      // Clear the error message
      const errorDiv = document.getElementById("error-message");
      if (errorDiv) {
        errorDiv.remove();
      }

      loader.style.display = "none"; // Hide the loader once questions are fetched
    });
}
function buildApiUrlBasedOnSelection() {
  // Get selected category and difficulty
  const selectedCategory = categorySelect.value;
  const selectedDifficulty = difficultySelect.value;
  categorySelect.disabled = true;
  difficultySelect.disabled = true;
  // Check if the user has made a selection
  // Exceptional Cases due to lack of questions in api for a particular combo of difficulty & category:
  // Art - hard
  // Celebrities - hard
  // Gadgets - hard
  // Musicals & Theatre - easy
  if (
    (selectedCategory === "13" && selectedDifficulty === "easy") ||
    (selectedCategory === "25" && selectedDifficulty === "hard") ||
    (selectedCategory === "26" && selectedDifficulty === "hard") ||
    (selectedCategory === "30" && selectedDifficulty === "hard")
  ) {
    displayErrorMessage(
      "Sorry, not enough questions with this combo. Difficulty = Any"
    );
    displayLoader(false); // Hide the loader in this case

    return `https://opentdb.com/api.php?amount=10&category=${selectedCategory}`;
  } else if (selectedCategory !== "any" && selectedDifficulty !== "any") {
    // Construct the API URL with the selected category and difficulty
    return `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}`;
  } else if (selectedCategory === "any" && selectedDifficulty !== "any") {
    return `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}`;
  } else if (selectedCategory !== "any" && selectedDifficulty === "any") {
    return `https://opentdb.com/api.php?amount=10&category=${selectedCategory}`;
  } else {
    return "https://opentdb.com/api.php?amount=10";
  }
}

// Question Functions:
function displayQuestion() {
  console.log("Displaying question:", currentQuestionIndex);

  quitButton.style.display = "block";
  progressBar.style.display = "block";

  if (isAnsweringAllowed) {
    const question = questions[currentQuestionIndex];
    const questionElement = createQuestionElement(question);
    quizContainer.innerHTML = "";
    quizContainer.appendChild(questionElement);

    const answerList = document.getElementById("answerList");
    answerList.addEventListener("click", handleAnswer);
    progressBar.value = currentQuestionIndex;
  }
}
function createQuestionElement(question) {
  const questionElement = document.createElement("div");
  questionElement.id = "question-div";

  const categoryDifficultyDiv = createCategoryDifficultyDiv(question);
  const questionTextWithSVG = replaceQuestionMarkWithSVG(question.question);

  // Shuffle the answers
  const shuffledAnswers = shuffleArray([
    ...question.incorrect_answers,
    question.correct_answer,
  ]);
  const answerListHTML = createAnswerListHTML(shuffledAnswers);

  questionElement.innerHTML = `
    ${categoryDifficultyDiv}
    <p id="question-p">${questionTextWithSVG}</p>
    <ul id="answerList">${answerListHTML}</ul>
  `;

  return questionElement;
}
function createCategoryDifficultyDiv(question) {
  return `
    <div id="categoryDifficultyDiv"> 
      <p class="categoryDifficulty-p p-3" id="category-p">Category: ${
        question.category
      }</p> 
      <p class="categoryDifficulty-p p-3" id="difficulty-p">Difficulty: ${capitalizeFirstLetter(
        question.difficulty
      )}</p>
    </div>
  `;
}
function replaceQuestionMarkWithSVG(text) {
  return text.replace(
    "?",
    `
   <img src="./assets/icons/question-mark.svg" alt="Question Icon">

  `
  );
}
function createAnswerListHTML(answers) {
  const answerLabels = ["A", "B", "C", "D"];
  return answers
    .map((answer, index) => {
      return `<li class="answer-li m-3 p-3">${answerLabels[index]}. ${answer}</li>`;
    })
    .join("");
}

// Answer Handler Functions:
function handleAnswer(event) {
  console.log("Handling answer:", event.target.textContent);

  if (isAnsweringAllowed && event.target.tagName === "LI") {
    const selectedAnswer = event.target.textContent.trim().substring(3); // Extract the answer text without the label

    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    const isCorrect = selectedAnswer === correctAnswer;

    const feedbackMessage = isCorrect
      ? `
      <img src="./assets/icons/correct.svg" alt="Correct Icon">
      Correct!
    `
      : `<img src="./assets/icons/incorrect.svg" alt="Incorrect Icon">
      Incorrect. The correct answer is: ${correctAnswer}`;
    displayFeedback(feedbackMessage);
    // Update the user's score
    if (isCorrect) {
      userScore++;
    }
  }
}
function displayFeedback(message) {
  console.log("Displaying feedback:", message);

  const feedbackElement = document.createElement("div");
  feedbackElement.id = "feedbackDiv";

  feedbackElement.innerHTML = message;
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

// Utility Functions:
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
