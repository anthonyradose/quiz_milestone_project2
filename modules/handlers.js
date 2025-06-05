import { isAnsweringAllowed, questions, currentQuestionIndex, userScore, quitButton, quizContainer, updateQuestionIndex, updateUserScore, errorDiv } from "../quiz.js";
import { endGame } from "./game.js";
import { displayQuestion } from "./questions.js";

const newErrorDiv = document.createElement("div");

/**
 * Handles user-selected answers, checks correctness, and updates the UI with feedback.
 * @param {Event} event - The click event on an answer option.
 */
function handleAnswer(event) {
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
      updateUserScore(userScore + 1);
    }
  }
}

/**
 * Displays feedback message, removes existing elements, and schedules the next question or quiz end.
 * @param {string} message - The feedback message to be displayed.
 */
function displayFeedback(message) {
  quitButton.style.display = "none";

  const feedbackElement = document.createElement("div");
  feedbackElement.id = "feedbackDiv";

  feedbackElement.innerHTML = message;

  // Clear the existing feedback elements
  quizContainer.innerHTML = "";

  // Append the new feedback element
  quizContainer.appendChild(feedbackElement);

  // Delay the removal of the feedback element until the next question is displayed
  setTimeout(() => {
    feedbackElement.remove();

    // Move to the next question or end the quiz after removing the feedback
    updateQuestionIndex(currentQuestionIndex + 1);
    if (currentQuestionIndex < 10) {
      displayQuestion();
    } else {
      endGame();
    }
  }, 3000);
}

/**
 * Displays error messages to the user.
 * @param {string} message - The error message to be displayed.
 */
function displayErrorMessage(message) {
  if (errorDiv) {
    errorDiv.remove();
  }
  newErrorDiv.id = "error-message";
  newErrorDiv.innerHTML = `<p class="m-0">${message}</p>`;
  document.body.appendChild(newErrorDiv);
}

export { handleAnswer, displayFeedback, displayErrorMessage };