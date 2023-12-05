let questions;
let currentQuestionIndex = 0;
function startGame() {
    const fetchQuestions = () => {
        fetch("https://opentdb.com/api.php?amount=10")
            .then((response) => response.json())
            .then((data) => {
                questions = data.results;
                console.log(questions);
                displayQuestion();
            })
            .catch((error) => {
                console.error("Error:", error);
                console.error("Failed to load questions. Retrying...");
            });
    };
    fetchQuestions();
}

startButton.addEventListener("click", startGame);

function displayQuestion() {
    const questionElement = document.createElement("div");
    questionElement.innerHTML = `<p>${questions[currentQuestionIndex].question}</p>`;
    quizContainer.innerHTML = "";
    quizContainer.appendChild(questionElement);
}
