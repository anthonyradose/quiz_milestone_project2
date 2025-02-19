/* globals Choices */
/**
 * Initializes Choices.js dropdown for category selection.
 * @type {Choices}
 */
const commonClassNames = {
  containerInner: "custom-dropdown",
  containerOuter: "custom-choices",
  input: "choices__input",
  inputCloned: "choices__input--cloned",
  list: "choices__list",
  listItems: "choices__list--multiple",
  listSingle: "choices__list--single",
  listDropdown: "choices__list--dropdown",
  item: "option-el",
  itemSelectable: "choices__item--selectable",
  itemDisabled: "choices__item--disabled",
  itemOption: "choices__item--choice",
  group: "choices__group",
  groupHeading: "choices__heading",
  button: "choices__button",
  activeState: "is-active",
  focusState: "is-focused",
  openState: "is-open",
  disabledState: "is-disabled",
  highlightedState: "is-highlighted",
  selectedState: "is-selected",
  flippedState: "is-flipped",
};
const categoryDropdown = new Choices("#category", {
  searchEnabled: false,
  sorter: (a, b) => {
    if (a.value === "any") {
      return -1; // "any" comes first
    } else if (b.value === "any") {
      return 1; // "any" comes first
    } else {
      // Sort the other categories alphabetically
      return a.label.localeCompare(b.label);
    }
  },
  itemSelectText: "",
  classNames: { ...commonClassNames },
  allowHTML: true,
});
/**
 * Initializes Choices.js dropdown for difficulty selection.
 * @type {Choices}
 */
const difficultyDropdown = new Choices("#difficulty", {
  searchEnabled: false,
  shouldSort: false,
  shouldSortItems: false,
  itemSelectText: "",
  classNames: { ...commonClassNames },
  sorter: (a, b) => {
    const order = { any: 1, easy: 2, medium: 3, hard: 4 };
    return order[a.value] - order[b.value];
  },
  allowHTML: true,
});

// State Variables:
let currentQuestionIndex;
let questions;
let userScore;
let isAnsweringAllowed; // Flag to control answering during question loading

// Elements:
const quizContainer = document.getElementById("quizContainer");
const startButton = document.getElementById("startButton");
const playAgainButton = document.getElementById("playAgainButton");
const quitButton = document.getElementById("quitButton");
const categorySelect = document.getElementById("category");
const difficultySelect = document.getElementById("difficulty");
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progressBar");
const startButtonLanding = document.getElementById("startButtonLanding");
const landingPage = document.getElementById("landingPage");
const quizSection = document.getElementById("quizSection");
const categoryContainer = document.getElementById("categoryContainer");
const difficultyContainer = document.getElementById("difficultyContainer");
const worldQuizLogo = document.getElementById("worldQuizLogo");
const errorDiv = document.getElementById("error-message");
const newErrorDiv = document.createElement("div");
// Event Listeners:
startButtonLanding.addEventListener("click", () => {
  landingPage.style.display = "none";
  quizSection.style.display = "flex";
  initializeGameState();
});
startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", initializeGameState);
quitButton.addEventListener("click", quitGame);
progressBar.style.display = "none";

/**
 * Initializes the game state.
 */
function initializeGameState() {
  currentQuestionIndex = 0;
  questions = null;
  userScore = 0;
  progressBar.value = 0;
  isAnsweringAllowed = false;
  startButton.style.display = "block";
  categoryContainer.style.display = "block";
  difficultyContainer.style.display = "block";
  categorySelect.value = "any";
  difficultySelect.value = "any";
  categoryDropdown.setChoiceByValue("any");
  difficultyDropdown.setChoiceByValue("any");
  categorySelect.disabled = false;
  difficultySelect.disabled = false;
  playAgainButton.style.display = "none";
  quitButton.style.display = "none";
  quizContainer.innerHTML = "";
  quizContainer.style.display = "none";
  worldQuizLogo.style.height = "150px";
  worldQuizLogo.style.width = "150px";
}
