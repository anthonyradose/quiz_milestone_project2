// API Functions:
function fetchQuestions(apiUrl, retryCount = 3, retryDelay = 3000) {
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
        console.log(data);
        questions = data.results;
  
        if (questions && questions.length > 0) {
          isAnsweringAllowed = true; // Set answering flag to true after questions are loaded
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
        retry(retryCount);
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
  function buildApiUrlBasedOnSelection() {
    // Get selected category and difficulty
    const selectedCategory = categorySelect.value;
    const selectedDifficulty = difficultySelect.value;
    categorySelect.disabled = true;
    difficultySelect.disabled = true;
    // Check if the user has made a selection
    // Exceptional Cases due to lack of questions in api for a particular combo of difficulty & category:
    // Art - hard
    // Celebrities - hard
    // Gadgets - hard
    // Musicals & Theatre - easy
    if (
      (selectedCategory === "13" && selectedDifficulty === "easy") ||
      (selectedCategory === "25" && selectedDifficulty === "hard") ||
      (selectedCategory === "26" && selectedDifficulty === "hard") ||
      (selectedCategory === "30" && selectedDifficulty === "hard")
    ) {
      displayErrorMessage(
        "Sorry, not enough questions with this combo. Difficulty = Any"
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