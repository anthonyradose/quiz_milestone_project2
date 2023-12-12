let currentQuestionIndex = 0;
let questions;
let userScore = 0;
let isAnsweringAllowed = false; // Flag to control answering during question loading
const quizContainer = document.getElementById("quizContainer");
const startButton = document.getElementById("startButton");
const quitButton = document.getElementById("quitButton");
startButton.addEventListener("click", startGame);
quitButton.addEventListener("click", quitGame);

function startGame() {
    console.log("startGame function is being executed."); // Add this line
    // Check if the game is already in progress
    if (isAnsweringAllowed) {
        // If the game is in progress, reset the game state
        currentQuestionIndex = 0;
        questions = null;
        userScore = 0;
        isAnsweringAllowed = false;
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
        questionElement.innerHTML = `

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
        }
        else {
            endGame();
        }
    }, 3000); // Adjust the delay as needed
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function endGame() {
    quizContainer.innerHTML += `<p>Quiz completed! Your score is ${userScore}/10.</p>`;
    startButton.textContent = "Play Again";
    startGame();
}

function quitGame() {
    currentQuestionIndex = 0;
    questions = null;
    userScore = 0;
    isAnsweringAllowed = false;
    quizContainer.innerHTML = "<p>Game quit. Better luck next time!</p>";
}