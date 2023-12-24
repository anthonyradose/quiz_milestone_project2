/**
 * Hides the start elements on the UI, including category container, difficulty container, and start button.
 */
function hideStartElements() {
  categoryContainer.style.display = "none";
  difficultyContainer.style.display = "none";
  startButton.style.display = "none";
}

/**
 * Displays or hides the loader and adjusts the visibility of the quiz container.
 * @param {boolean} showLoader - If true, displays the loader; otherwise, hides it.
 */
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

/**
 * Initializes the UI elements for a new question, setting the display of quit button, progress bar, and world quiz logo.
 */
function initializeUIForQuestion() {
  quitButton.style.display = "block";
  progressBar.style.display = "block";
  worldQuizLogo.style.height = "100px";
  worldQuizLogo.style.width = "100px";
}
