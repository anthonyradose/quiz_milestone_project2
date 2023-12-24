// Answer Handler Functions:
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
function displayFeedback(message) {
  quitButton.style.display = "none";
  console.log("Displaying feedback:", message);

  const feedbackElement = document.createElement("div");
  feedbackElement.id = "feedbackDiv";

  feedbackElement.innerHTML = message;
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

function displayErrorMessage(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.remove();
  }

  const newErrorDiv = document.createElement("div");
  newErrorDiv.id = "error-message";
  newErrorDiv.style.backgroundColor = "lightblue";
  newErrorDiv.style.color = "black";
  newErrorDiv.style.padding = "1rem";
  newErrorDiv.style.border = "1px solid blue";
  newErrorDiv.style.position = "absolute";
  newErrorDiv.style.top = "70%";
  newErrorDiv.style.left = "50%";
  newErrorDiv.style.border = "none";
  newErrorDiv.style.borderRadius = "2px";
  newErrorDiv.style.transform = "translate(-50%, -50%)";
  newErrorDiv.innerHTML = `<p class="m-0">${message}</p>`;
  document.body.appendChild(newErrorDiv);
}

