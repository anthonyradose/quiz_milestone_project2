
function startGame() {
    const fetchQuestions = () => {
        fetch("https://opentdb.com/api.php?amount=10")
            .then((response) => response.json())
            .then((data) => {
                let questions = data.results;
                console.log(questions);
            });
    };
    fetchQuestions();
}

startButton.addEventListener("click", startGame);
