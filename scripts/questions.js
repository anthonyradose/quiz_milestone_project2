// Question Functions:
function displayQuestion() {
    console.log("Displaying question:", currentQuestionIndex);
  
    quitButton.style.display = "block";
    progressBar.style.display = "block";
  
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
  function replaceQuestionMarkWithSVG(text) {
    return text.replace(
      "?",
      `
     <img src="./assets/icons/question-mark.svg" alt="Question Icon">
  
    `
    );
  }
  function createAnswerListHTML(answers) {
    const answerLabels = ["A", "B", "C", "D"];
    return answers
      .map((answer, index) => {
        return `<li class="answer-li m-3 p-3">${answerLabels[index]}. ${answer}</li>`;
      })
      .join("");
  }