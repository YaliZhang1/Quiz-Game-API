const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const progressBar = document.getElementById("progress");
const scoreBoard = document.getElementById("score");
const progressText = document.getElementById("progress-text");

const questionsLength = 10;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

startButton.addEventListener("click", startQuiz);
progressBar.style.width = "0%";
async function fetchTrivia() {
  const url = "https://opentdb.com/api.php?amount=10&type=multiple";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    questions = data.results.map((item) => {
      const answers = [...item.incorrect_answers, item.correct_answer];
      return {
        question: item.question,
        correctAnswer: item.correct_answer,
        answers: answers.sort(() => Math.random() - 0.5),
      };
    });

    showQuestion();
  } catch (error) {
    console.error(error.message);
    const info = document.createElement("info");
    info.innerHTML = `Sorry, something went wrong! ${error.message}Please try again.`;
  }
}

function startQuiz() {
  resetState();
  score = 0;
  currentQuestionIndex = 0;
  nextButton.innerHTML = "Next";
  fetchTrivia();
  startButton.style.display = "none";
}

function showQuestion() {
  showProgress();
  const currentQuestion = questions[currentQuestionIndex];

  questionElement.innerHTML = `${currentQuestion.question}`;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (currentQuestion.correctAnswer == answer) {
      button.dataset.correct = "true";
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  questionElement.innerHTML = "";
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  progressBar.style.width = "100%";
  progressText.textContent = "100%";
  scoreBoard.innerHTML = "";
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;

  const comments = document.createElement("comments");
  comments.innerHTML = `
    <h3>Comments:</h3>
    <p>This quiz was created using a public API from Open Trivia Database.</p>
    <p>Feel free to share your score or ask any questions!</p>
    <p>Happy Quizzing!</p>`;
  answerButtons.appendChild(comments);
}
function showProgress() {
  progressBar.style.width = `${
    (currentQuestionIndex / questionsLength) * 100
  }%`;
  progressText.innerHTML = `${(currentQuestionIndex / questionsLength) * 100}%`;
  scoreBoard.innerHTML = `Score: ${score} `;
}
function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questionsLength) {
    resetState();
    showQuestion();
  } else {
    showScore();
    nextButton.style.display = "block";
    nextButton.style.width = "200px";
    nextButton.textContent = "Play Again";
  }
}
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questionsLength) {
    handleNextButton();
  } else {
    startQuiz();
  }
});
