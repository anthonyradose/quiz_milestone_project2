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
    icon =
      icon = `<img src="./assets/icons/neutral-face.svg" alt="Neutral Icon">`; // Star icon for medium scores
  } else {
    icon =
      icon = `<img src="./assets/icons/broken-heart.svg" alt="Heart Icon">`; // Star icon for medium scores
  }
  quizContainer.innerHTML += `<p class="m-0">Quiz completed! Your score is ${userScore}/10 ${icon}.</p>`;
  quizContainer.style.backgroundColor = "lightblue";
  quizContainer.style.color = "black";

  progressBar.style.display = "none";
  playAgainButton.style.display = "block";
}
function quitGame() {
  progressBar.style.display = "none";
  quitButton.style.display = "none";
  quizContainer.innerHTML =
    "<p class='m-0'>Game quit. Better luck next time!</p>";
  quizContainer.style.backgroundColor = "lightblue";
  quizContainer.style.color = "black";

  setTimeout(() => {
    quizContainer.innerHTML = "";
    initializeGameState();
  }, 1000);
}
