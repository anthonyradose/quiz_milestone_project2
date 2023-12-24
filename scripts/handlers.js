/**
 * Handles user-selected answers, checks correctness, and updates the UI with feedback.
 * @param {Event} event - The click event on an answer option.
 */
function handleAnswer(event) {
  console.log("Handling answer:", event.target.textContent);

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
      userScore++;
    }
  }
}

/**
 * Displays feedback message, removes existing elements, and schedules the next question or quiz end.
 * @param {string} message - The feedback message to be displayed.
 */
function displayFeedback(message) {
  quitButton.style.display = "none";
  console.log("Displaying feedback:", message);

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
    currentQuestionIndex++;
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
