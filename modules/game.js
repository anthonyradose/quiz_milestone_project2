import { hideStartElements, displayLoader } from "./ui.js";
import { buildApiUrlBasedOnSelection, fetchQuestions } from "./api.js";
import { displayErrorMessage } from "./handlers.js";
import { progressBar, quitButton, playAgainButton, quizContainer, initializeGameState, userScore } from "../quiz.js";

/**
 * Starts the game by hiding start elements, displaying the loader,
 * building the API URL based on user selection, and fetching questions.
 */
function startGame() {
 
  hideStartElements();
  displayLoader();
  const apiUrl = buildApiUrlBasedOnSelection();
  if(displayErrorMessage) {
    setTimeout(() => {fetchQuestions(apiUrl);}, 3000);
  }
  else fetchQuestions(apiUrl);
}

/**
 * Quits the game, hides elements, displays a message, and resets the game state after a delay.
 */
function quitGame() {
  progressBar.style.display = "none";
  quitButton.style.display = "none";
  playAgainButton.style.display = "none"; // Hide the Play Again button
  quizContainer.innerHTML =
    "<p class='m-0'>Game quit. Better luck next time!</p>";
  quizContainer.style.backgroundColor = "lightblue";
  quizContainer.style.color = "black";

  setTimeout(() => {
    quizContainer.innerHTML = "";
    initializeGameState();
  }, 1000);
}

/**
 * Ends the game by determining the user's score, displaying an appropriate icon,
 * and showing a completion message with the score. Updates UI styles accordingly.
 */
function endGame() {
  let icon;

  if (userScore >= 7 && userScore <= 10) {
    icon = `<img src="./assets/icons/trophy.svg" alt="Trophy Icon">`; // Trophy icon for high scores
  } else if (userScore >= 4 && userScore <= 6) {
    icon = `<img src="./assets/icons/neutral-face.svg" alt="Neutral Icon">`; // Neutral face icon for medium scores
  } else {
    icon = `<img src="./assets/icons/broken-heart.svg" alt="Heart Icon">`; // Broken heart icon for low scores
  }

  quizContainer.innerHTML += `<p class="m-0">Quiz completed! Your score is ${userScore}/10 ${icon}</p>`;
  quizContainer.style.backgroundColor = "lightblue";
  quizContainer.style.color = "black";

  progressBar.style.display = "none";
  playAgainButton.style.display = "block";
  quitButton.style.display = "block";
}

export { startGame, quitGame, endGame };