import { displayErrorMessage } from "./handlers.js";
import { displayLoader } from "./ui.js";
import { displayQuestion } from "./questions.js";
import { loader, quizSection, categorySelect, difficultySelect, questions, updateQuestions, updateAnsweringAllowed } from "../quiz.js";

/**
 * Fetches questions from the specified API URL.
 *
 * @param {string} apiUrl - The URL to fetch questions from.
 * @param {number} [retryCount=3] - The number of retry attempts in case of failure.
 * @param {number} [retryDelay=1000] - The delay (in milliseconds) between retry attempts.
 */
function fetchQuestions(apiUrl, retryCount = 3, retryDelay = 1000) {
  /**
   * Retries fetching questions in case of failure.
   *
   * @param {number} count - The number of retry attempts left.
   */
  const retry = (count) => {
    if (count > 0) {
      setTimeout(() => {
        console.log(`Retrying... (Attempts left: ${count})`);
        fetchQuestions(apiUrl, count - 1, retryDelay);
      }, retryDelay);
    } else {
      console.error("Max retries reached. Could not fetch questions.");
      displayErrorMessage(
        "Sorry, there was an issue fetching questions. Please try again later."
      );
      loader.style.display = "none";
    }
  };

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      updateQuestions(data.results);

      if (questions && questions.length > 0) {
        updateAnsweringAllowed(true); // Set answering flag to true after questions are loaded
        displayQuestion();
      } else {
        console.error("No questions loaded.");
        retry(retryCount);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (error.response) {
        console.error("HTTP Status Code:", error.response.status);
        quizSection.innerHTML = `<p class="error-message">HTTP Status Code: ${error.response.status}</p>`;
      }
      console.error("Failed to load questions.");
      setTimeout(() => retry(retryCount), retryDelay); // Introduce a delay before retrying
    })
    .finally(() => {
      const answerListFetchQuestions = document.getElementById("answerList");
      if (answerListFetchQuestions) {
        answerListFetchQuestions.style.pointerEvents = "auto"; // Enable answer options after fetch (success or failure)
      }

      // Clear the error message
      const errorDiv = document.getElementById("error-message");
      if (errorDiv) {
        errorDiv.remove();
      }

      loader.style.display = "none"; // Hide the loader once questions are fetched
    });
}

/**
 * Builds the API URL based on the user's category and difficulty selection.
 *
 * @returns {string} - The constructed API URL.
 */
function buildApiUrlBasedOnSelection() {
  // Get selected category and difficulty
  const selectedCategory = categorySelect.value;
  const selectedDifficulty = difficultySelect.value;
  categorySelect.disabled = true;
  difficultySelect.disabled = true;

  // Check exceptional cases due to lack of questions in the API for a particular combo of difficulty & category
  if (
    (selectedCategory === "13" && selectedDifficulty === "easy") ||
    (selectedCategory === "25" && selectedDifficulty === "hard") ||
    (selectedCategory === "26" && selectedDifficulty === "hard") ||
    (selectedCategory === "30" && selectedDifficulty === "hard")
  ) {
    displayErrorMessage(
      "Sorry, not enough questions with this combo. Setting difficulty to any."
    );
    displayLoader(false); // Hide the loader in this case

    return `https://opentdb.com/api.php?amount=10&category=${selectedCategory}`;
  } else if (selectedCategory !== "any" && selectedDifficulty !== "any") {
    // Construct the API URL with the selected category and difficulty
    return `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}`;
  } else if (selectedCategory === "any" && selectedDifficulty !== "any") {
    return `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}`;
  } else if (selectedCategory !== "any" && selectedDifficulty === "any") {
    return `https://opentdb.com/api.php?amount=10&category=${selectedCategory}`;
  } else {
    return "https://opentdb.com/api.php?amount=10";
  }
}

export { fetchQuestions, buildApiUrlBasedOnSelection };