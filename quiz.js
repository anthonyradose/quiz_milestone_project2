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
quitButton.style.display="none"
  quizContainer.innerHTML = "";
  quizContainer.style.display = "none";
}

function startGame() {
  document.getElementById("categoryContainer").style.display = "none";
  document.getElementById("difficultyContainer").style.display = "none";
  startButton.style.display = "none";
  loader.style.display = "block";
  quizContainer.style.display = "block";
  quizContainer.style.backgroundColor = "transparent";
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

  


}
// const fetchQuestions = (apiUrl) => {
//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       questions = data.results;
//       if (questions && questions.length > 0) {
//         isAnsweringAllowed = true; // Set answering flag to true after questions are loaded
//         displayQuestion();
//       } else {
//         console.error("No questions loaded.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       console.error("Failed to load questions. Retrying...");
//     })
//     .finally(() => {
//       loader.style.display = "none";
//       const answerList = document.getElementById("answerList");
//       if (answerList) {
//         answerList.style.pointerEvents = "auto"; // Enable answer options after fetch (success or failure)
//       }
//     });
// };

const fetchQuestions = (apiUrl, timeout = 1000) => {
  console.log("Fetching questions from:", apiUrl);

  // Create a promise that rejects after the specified timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout exceeded")), timeout);
  });

  // Combine the fetch request with the timeout promise
  Promise.race([fetch(apiUrl), timeoutPromise])
    .then((response) => {
      // Check if the response is from the API or the timeout
      if (response instanceof Response) {
        console.log("Response status:", response.status);
        return response.json();
      } else {
        throw new Error("API request timed out");
      }
    })
    .then((data) => {
      console.log("Received data:", data);
      questions = data.results;
      if (questions && questions.length > 0) {
        isAnsweringAllowed = true; // Set answering flag to true after questions are loaded
        displayQuestion();
      } else {
        console.error("No questions loaded. Using mock data.");
        // Mock Data for when API is down
        const mockData = [
          {
            category: "General Knowledge",
            difficulty: "Medium",
            question: `What is the capital of France<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><g data-name="Layer 2"><circle cx="256" cy="256" r="256" fill="#ffea00" opacity="1" data-original="#ff2147" class=""></circle><g fill="#fff"><path d="M252.94 395.94h-25.38c-5.74 0-9.58-3.7-9.6-9.42 2.1-65.89-11.87-60.86 35.69-60.59 45.7-.33 32.19-4.8 34.29 59.78 0 6.71-3.51 10.23-10.17 10.24zM251.9 312c-8.28 0-16.56-.06-24.84 0-6.76.43-8.08-7.28-9-12.35-2.35-21.88 6.75-38.87 22.85-52.87 11.3-10.81 26.76-15.33 38.72-25.09 11.14-9.61 10-25.83-1.87-34.37-12.92-9.26-33.48-10.23-46.73-1.66-9.37 6.58-16.28 16.24-23.7 24.87-4.38 5.21-8.71 5.77-14.12 1.67q-17.05-12.92-34-25.93c-4.78-3.66-5.41-7.9-2.29-13 31.3-57.2 110.88-75.8 163.08-36 35 22.77 50.45 73.95 23.25 108.46-10.63 15-28.66 21.56-42.77 32.52C280.56 295 293 310.76 276.75 312H251.9z" fill="#ffffff" opacity="1" data-original="#ffffff"></path></g></g></g></svg>`,
            correct_answer: "B. Paris",
            incorrect_answers: ["C. Berlin", "D. Madrid", "A. Rome"],
          },
          // Add more mock questions as needed
        ];
        console.log("Using mock data:", mockData);
        questions = mockData;
        isAnsweringAllowed = true;
        displayQuestion();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      console.error("Failed to load questions. Retrying...");
      // Optionally, you can use mock data for testing
      const mockData = [
        {
          category: "General Knowledge",
          difficulty: "Medium",
          question: `What is the capital of France <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><g data-name="Layer 2"><circle cx="256" cy="256" r="256" fill="#ffea00" opacity="1" data-original="#ff2147" class=""></circle><g fill="#fff"><path d="M252.94 395.94h-25.38c-5.74 0-9.58-3.7-9.6-9.42 2.1-65.89-11.87-60.86 35.69-60.59 45.7-.33 32.19-4.8 34.29 59.78 0 6.71-3.51 10.23-10.17 10.24zM251.9 312c-8.28 0-16.56-.06-24.84 0-6.76.43-8.08-7.28-9-12.35-2.35-21.88 6.75-38.87 22.85-52.87 11.3-10.81 26.76-15.33 38.72-25.09 11.14-9.61 10-25.83-1.87-34.37-12.92-9.26-33.48-10.23-46.73-1.66-9.37 6.58-16.28 16.24-23.7 24.87-4.38 5.21-8.71 5.77-14.12 1.67q-17.05-12.92-34-25.93c-4.78-3.66-5.41-7.9-2.29-13 31.3-57.2 110.88-75.8 163.08-36 35 22.77 50.45 73.95 23.25 108.46-10.63 15-28.66 21.56-42.77 32.52C280.56 295 293 310.76 276.75 312H251.9z" fill="#ffffff" opacity="1" data-original="#ffffff"></path></g></g></g></svg>`,
          correct_answer: "Paris",
          incorrect_answers: ["Berlin", "Madrid", "Rome"],
        },
        // Add more mock questions as needed
      ];
      console.log("Using mock data:", mockData);
      questions = mockData;
      isAnsweringAllowed = true;
      displayQuestion();
    })
    .finally(() => {
      loader.style.display = "none";
      const answerList = document.getElementById("answerList");
      if (answerList) {
        answerList
        .style.pointerEvents = "auto"; // Enable answer options after fetch (success or failure)
      }
    });
};

function displayQuestion() {
  quitButton.style.display = "block";
  progressBar.style.display = "block"
  if (isAnsweringAllowed) {
    // Check if answering is allowed before displaying the question
    const question = questions[currentQuestionIndex];
    const questionElement = document.createElement("div");
    questionElement.id = "question-div";
    // Display selected category and difficulty if available
    const categoryDifficultyDiv = `
    
   <div id="categoryDifficultyDiv"> 
    <p class="categoryDifficulty-p p-3" id="category-p">Category: ${question.category}</p> 
    <p class="categoryDifficulty-p p-3" id="difficulty-p">Difficulty: ${question.difficulty}</p>
   </div>
    `;
    questionElement.innerHTML = `

    ${categoryDifficultyDiv}

      <p id="question-p">${question.question}</p>
      <ul id="answerList">
        ${shuffleArray([...question.incorrect_answers, question.correct_answer])
          .map((answer) => `<li class="answer-li p-3">${answer}</li>`)
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
      ? `
      <svg
        id="Layer_1"
        enable-background="new 0 0 512 512"
        height="30"
        viewBox="0 0 512 512"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-rule="evenodd" fill-rule="evenodd">
          <path
            d="m256 0c-141.2 0-256 114.8-256 256s114.8 256 256 256 256-114.8 256-256-114.8-256-256-256z"
            fill="#4bae4f"
          />
          <path
            d="m379.8 169.7c6.2 6.2 6.2 16.4 0 22.6l-150 150c-3.1 3.1-7.2 4.7-11.3 4.7s-8.2-1.6-11.3-4.7l-75-75c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l63.7 63.7 138.7-138.7c6.2-6.3 16.4-6.3 22.6 0z"
            fill="#fff"
          />
        </g>
      </svg>
      Correct!
    `
      : `<svg    width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g id="Layer_19" data-name="Layer 19"><circle cx="25" cy="25" fill="#ee685c" r="22.5"/><path d="m32.91076 30.08233-5.08233-5.08233 5.08233-5.08233a2 2 0 0 0 0-2.82843 2 2 0 0 0 -2.82843 0l-5.08233 5.08233-5.08233-5.08233a2 2 0 0 0 -2.82843 0 2 2 0 0 0 0 2.82843l5.08233 5.08233-5.08233 5.08233a2 2 0 0 0 0 2.82843 2 2 0 0 0 2.82843 0l5.08233-5.08233 5.08233 5.08233a2 2 0 0 0 2.82843 0 2 2 0 0 0 0-2.82843z" fill="#fff"/></g></svg>Incorrect. The correct answer is: ${correctAnswer}`;
    displayFeedback(feedbackMessage);
    // Update the user's score
    if (isCorrect) {
      userScore++;
    }
    
  }
  
}

function displayFeedback(message) {
  
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
    if (currentQuestionIndex < 1) {
      displayQuestion();

    } else {
      endGame();
    }
  }, 3000); // Adjust the delay as needed
}

function endGame() {
  let icon;

  if (userScore >= 7 && userScore <= 10) {
    icon = "🏆"; // Trophy icon for high scores
  } else if (userScore >= 4 && userScore <= 6) {
    icon = "😐"; // Star icon for medium scores
  } else {
    icon = "💔"; // Confetti icon for low scores
  }
  quizContainer.innerHTML += `<p>Quiz completed! Your score is ${userScore}/10 ${icon}.</p>`;
  quizContainer.style.backgroundColor = "lightblue";

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
  quizContainer.style.backgroundColor = "lightblue";
  progressBar.style.display = "none";
  quitButton.style.display = "none";
  setTimeout(() => {
    quizContainer.innerHTML = "";
    initializeGameState();
  }, 3000);
}
