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
