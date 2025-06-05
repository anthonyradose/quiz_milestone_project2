import { isAnsweringAllowed, questions, currentQuestionIndex, progressBar, quizContainer } from "../quiz.js";
import { initializeUIForQuestion } from "./ui.js";
import { handleAnswer } from "./handlers.js";
import { shuffleArray, capitalizeFirstLetter } from "./utilities.js";

/**
 * Displays a new question on the UI, initializing the UI components for the question.
 */
function displayQuestion() {
  initializeUIForQuestion();

  if (isAnsweringAllowed) {
    const question = questions[currentQuestionIndex];
    const questionElement = createQuestionElement(question);
    quizContainer.innerHTML = "";
    quizContainer.appendChild(questionElement);

    const answerList = document.getElementById("answerList");
    answerList.addEventListener("click", handleAnswer);
    progressBar.value = currentQuestionIndex;
  }
}

/**
 * Creates a question element with category, difficulty, and answer options.
 * @param {Object} question - The question object containing category, difficulty, and answers.
 * @returns {HTMLElement} The HTML element representing the question.
 */
function createQuestionElement(question) {
  const questionElement = document.createElement("div");
  questionElement.id = "question-div";

  const categoryDifficultyDiv = createCategoryDifficultyDiv(question);
  const questionTextWithSVG = replaceQuestionMarkWithSVG(question.question);

  // Shuffle the answers
  const shuffledAnswers = shuffleArray([
    ...question.incorrect_answers,
    question.correct_answer,
  ]);
  const answerListHTML = createAnswerListHTML(shuffledAnswers);

  questionElement.innerHTML = `
      ${categoryDifficultyDiv}
      <p id="question-p">${questionTextWithSVG}</p>
      <ul id="answerList">${answerListHTML}</ul>
    `;

  return questionElement;
}

/**
 * Creates a div containing category and difficulty information.
 * @param {Object} question - The question object containing category and difficulty information.
 * @returns {string} The HTML string representing the category and difficulty div.
 */
function createCategoryDifficultyDiv(question) {
  return `
      <div id="categoryDifficultyDiv"> 
        <p class="categoryDifficulty-p p-3" id="category-p">Category: ${
          question.category
        }</p> 
        <p class="categoryDifficulty-p p-3" id="difficulty-p">Difficulty: ${capitalizeFirstLetter(
          question.difficulty
        )}</p>
      </div>
    `;
}

/**
 * Replaces the question mark in the text with a question mark SVG icon.
 * @param {string} text - The text containing a question mark to be replaced.
 * @returns {string} The updated text with the question mark replaced by an SVG icon.
 */
function replaceQuestionMarkWithSVG(text) {
  return text.replace(
    "?",
    `
     <img src="./assets/icons/question-mark.svg" alt="Question Icon">
    `
  );
}

/**
 * Creates HTML for the answer options based on shuffled answers.
 * @param {string[]} answers - The array of shuffled answer options.
 * @returns {string} The HTML string representing the answer options list.
 */
function createAnswerListHTML(answers) {
  const answerLabels = ["A", "B", "C", "D"];
  return answers
    .map((answer, index) => {
      return `<li class="answer-li p-3">${answerLabels[index]}. ${answer}</li>`;
    })
    .join("");
}

export { displayQuestion, createQuestionElement, createCategoryDifficultyDiv, replaceQuestionMarkWithSVG, createAnswerListHTML };