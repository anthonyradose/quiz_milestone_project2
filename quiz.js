let currentQuestionIndex = 0;
let questions;
let userScore = 0;
let isAnsweringAllowed = false; // Flag to control answering during question loading
const quizContainer = document.getElementById("quizContainer");
const startButton = document.getElementById("startButton");
const quitButton = document.getElementById("quitButton");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progressBar");
startButton.addEventListener("click", startGame);
quitButton.addEventListener("click", quitGame);
const startButtonLanding = document.getElementById("startButtonLanding");
const landingPage = document.getElementById("landingPage");
const quizSection = document.getElementById("quizSection");

startButtonLanding.addEventListener("click", () => {
    landingPage.style.display = "none";
    quizSection.style.display = "block";
});
quitButton.style.display = "none";

function startGame() {
    document.getElementById("categoryContainer").style.display = "none";
    document.getElementById("difficultyContainer").style.display = "none";
    // Reset the game state
    currentQuestionIndex = 0;
    questions = null;
    userScore = 0;
    progressBar.value = 0;
    isAnsweringAllowed = false;
    startButton.style.display = "none";
    loader.style.display = "block";

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
    startButton.textContent = "Play Again";
    startButton.style.display = "block";
    startButton.addEventListener("click", () => {
        // Reset current question index
        currentQuestionIndex = 0;
        // Enable the dropdowns after the game ends or the user quits
        categorySelect.disabled = false;
        difficultySelect.disabled = false;
        // Reset the category dropdown to its default state
        categorySelect.value = "any";
        difficultySelect.value = "any";
        startGame();
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function quitGame() {
    // Show the dropdowns after the user quits
    document.getElementById("categoryContainer").style.display = "block";
    document.getElementById("difficultyContainer").style.display = "block";
    // Reset the game state and display a message
    currentQuestionIndex = 0;
    questions = null;
    userScore = 0;
    progressBar.value = 0;
    isAnsweringAllowed = false;
    startButton.style.display = "block";
    quizContainer.innerHTML = "<p>Game quit. Better luck next time!</p>";
    // Enable the dropdowns after the game ends or the user quits
    categorySelect.disabled = false;
    difficultySelect.disabled = false;
    categorySelect.value = "any";
    difficultySelect.value = "any";
}
