import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {storage, ISCdb, db, auth} from "../DataCenter/firebase.js"

async function fetchQuestions() {
  const questionsRef = collection(ISCdb, "Quizzes", quizId, "Questions");
  const snapshot = await getDocs(questionsRef);

  const questions = [];
  snapshot.forEach((doc) => {
    questions.push(doc.data());
  });

  return questions;
}

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

let userScore = 0;
let currentQuestionIndex = 0; 
const quizContainer = document.getElementById("quiz-container");

async function renderQuestion() {
  const questions = await fetchQuestions();
  const quizNameDisplay = document.getElementById("quiz-name");

  const maxQuestions = questions.length;
  localStorage.setItem("quizMaxQuestions", maxQuestions);


  quizNameDisplay.innerHTML = `${quizId} Quiz :`;
  // Clear the container to avoid duplicate questions
  quizContainer.innerHTML = "";

  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    const questionElement = document.createElement("div");
    questionElement.classList.add("question-item");


    let chosenAnswer = "";

    
    questionElement.innerHTML = `
      <p id="question-text">${question.questionText}</p>
      <ul>
   
    <li id="choiceA"> <p id="corresponding-choice">A</p> ${question.questionChoiceA}</li>
    <li id="choiceB"> <p id="corresponding-choice">B</p>${question.questionChoiceB}</li>
    <li id="choiceC"> <p id="corresponding-choice">C</p>${question.questionChoiceC}</li>
    <li id="choiceD"> <p id="corresponding-choice">D</p>${question.questionChoiceD}</li>
      </ul>

      <h4 class="questionNumber">Question : ${currentQuestionIndex + 1} / ${questions.length}</h4>
      <div id="timer"></div>
    `;

    const timerElement = questionElement.querySelector("#timer");
    let timeLeft = 15;

    const timerInterval = setInterval(() => {
      timerElement.textContent = `Time Remaining: ${timeLeft} seconds`;
      timeLeft--;

      if (timeLeft === 0) {
        clearInterval(timerInterval);
        if (!questionAnswered) {
          // No answer chosen, skip to next question without score increase
          currentQuestionIndex++;
          renderQuestion();
        }
      }
    }, 1000);


    let questionAnswered = false
    const choices = questionElement.querySelectorAll("li");
    choices.forEach((choice) => {
      choice.addEventListener("click", function () {
        if(!questionAnswered){

        questionAnswered = true;
        chosenAnswer = this.querySelector("p#corresponding-choice").textContent;

        if(chosenAnswer == question.correctChoice) {

        this.style.backgroundColor = "lightblue";
        userScore++;
        }

        if (chosenAnswer !== question.correctChoice) {

          this.style.backgroundColor = "#dd515f"; // Highlight incorrect choice in red
          this.style.color = "black";

          choices.forEach((choice) => {

            if (choice.querySelector("p#corresponding-choice").textContent === question.correctChoice) {
              choice.style.backgroundColor = "lightblue"; 
              this.style.color = "black";

            }
          })
        }

        // Increment currentQuestionIndex and render next question
        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 1500);
      }
    });
 });


    
    quizContainer.appendChild(questionElement);
  } else {

    localStorage.setItem("quizScore", userScore);
    const endQuizUrl = `/Quizzes%20Pages/endQuiz.html?id=${quizId}&userId=${userId}`;
    window.location.href = endQuizUrl;
  }
}

renderQuestion(); // Render the initial question



