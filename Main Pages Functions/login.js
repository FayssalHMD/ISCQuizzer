import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, set, ref ,get,child} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import {storage, ISCdb, db, auth, dbref} from "../DataCenter/firebase.js";

// To-Top-Button
const toTop = document.querySelector(".to-top-button");
window.addEventListener("scroll" ,function(){
  if(window.pageYOffset > 100){
    toTop.classList.add("active");
  }
  else{
    toTop.classList.remove("active");
  }
})
//To-Top-Button

//Scroll down button

const scrollWord = document.getElementById("scroll-down");

// Add click event listener
scrollWord.addEventListener("click", () => {
    const scrollToElement = document.getElementById("available-quizzes");

    scrollToElement.scrollIntoView({ behavior: "smooth" }); 
});


//Nav-links Buttons Appear :

const menuButton = document.getElementById('menu-button');
const popupNav = document.getElementById('pop-up-nav');

menuButton.addEventListener('click', () => {
  popupNav.classList.toggle('activeBar');
});


//Admins Login System :


const adminForm = document.getElementById("admin-login-form");
const emailInp = document.getElementById("email-input");
const passwordInp = document.getElementById("password-input");


let signInUser = evt => {
  evt.preventDefault();

  signInWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
  .then((credentials) => {
    get(child(dbref, 'AdminsAuthList/' + credentials.user.uid)).then((snapshot) => {
      if(snapshot.exists){
        localStorage.setItem("admin-info",JSON.stringify({
          firstname : snapshot.val().firstname,
          lastname : snapshot.val().lastname
        }))
        localStorage.setItem("admin-creds", JSON.stringify(credentials.user));
        adminForm.reset();
        window.location.href = "post_login.html";
      }
    })
  })
  .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
  })
}

  adminForm.addEventListener("submit", signInUser);

//Display the different Quizzes from the Database : 

import {getStorage, ref as sRef , uploadBytesResumable , getDownloadURL} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getFirestore, collection, doc as adoc, setDoc, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const quizzesContainer = document.getElementById("big-container")




async function displayAllQuizzes(){
const quizzesRef = collection(ISCdb, "Quizzes");
const snapshot = await getDocs(quizzesRef);

const array = [];
snapshot.forEach(async (doc) => {
    const data = doc.data();



    const quizItem = document.createElement("div");
    quizItem.classList.add("quiz-container");

    const viewQuizButton = document.createElement("button");
    viewQuizButton.textContent = "Start Quiz";
    viewQuizButton.classList.add("start-quiz-button");
    const quizStartState = false;

    
    viewQuizButton.addEventListener("click", () => {
    

      const allButtons = document.querySelectorAll(".start-quiz-button");
            allButtons.forEach(button => {
                if (button !== viewQuizButton) {
                    button.disabled = true;
                }
            });


      const userForm = document.createElement("form");
      const startQuizButton = document.createElement("button");
      
      userForm.classList.add("user-form");
      startQuizButton.textContent = "Start Quiz";
      startQuizButton.type = "submit";
      startQuizButton.id ="startBtn"  


      userForm.addEventListener("submit",async (e)=>{
        e.preventDefault();
        const userInfoData = Object.fromEntries(new FormData(userForm).entries());

        if(userInfoData.nickName == "" || userInfoData.familyName == "" || userInfoData.userEmail == "") {
          alert("Please fill all the data !");
          userForm.reset();
        }else{

        userInfoData.score = 0; // Initialize score
        userInfoData.quizMaxQuestions = doc.data().questionNumber;


        //Add a new collection : 
      const userInfoRef = collection(doc.ref, "Players");
      const newUserRef = adoc(userInfoRef, userInfoData.nickName);

      userInfoData.workshop = data.quizName;
      await setDoc(newUserRef, userInfoData);

       window.location.href = `../Quizzes Pages/quiz.html?id=${doc.id}&userId=${newUserRef.id}`;

     } 
    })
      userForm.innerHTML = `
          <h2 id="personal-information-title">Please enter your personal Information </h2>

          <div class="text_field">

            <input type="text" id="userName" name="nickName">
            <label>Nick-Name:</label>

          </div>

          <div class="text_field">

            <input type="text" id="familyName" name="familyName">
            <label>Family-Name:</label>

          </div>

          <div class="text_field">

            <input type="email" id="userEmail" name="userEmail">
            <label>Email:</label>

          </div>
        
            <p class="which-quiz-form">Quiz Of : <span>${data.quizName}</span></p>

      `
      // Redirect to quiz view page with quiz ID
      userForm.appendChild(startQuizButton);
      quizzesContainer.appendChild(userForm);
      quizItem.style.display = "none";

      
    });

    quizItem.innerHTML = `
        <img src = "${data.imgURL}"> 
        <div class="info">
        <h3 class="quiz-title">${data.quizName}</h3>
        <p class="quiz-description">${data.quizDescription}</p>
        <p class="quiz-max-questions">Number of Questions: <span class="number-of-questions">${data.questionNumber}</span></p>
        </div>

    `;

    const playersRef = collection(doc.ref, "Players");
    const playersSnapshot = await getDocs(playersRef);


    const sortedPlayers = playersSnapshot.docs.map((playerDoc) => playerDoc.data())
            .sort((a, b) => b.score - a.score);
            
    // Display players data

    const highScoresContainer = document.getElementById("display-highscores");
    const highscoresQuizzes = document.getElementById("highscores-quizzes");


    const playersContainer = document.createElement("div");
    playersContainer.classList.add("quizzs-scores");
    playersContainer.innerHTML = `
          <div class="classement-title"> 
            <h3 class="quiz-classement-name">${data.quizName}</h3>
          </div>
    `

    highScoresContainer.appendChild(highscoresQuizzes);
    const users = [];
    
    sortedPlayers.forEach((playerData,index) => {
        
        users.push(playerData);

        const playerElement = document.createElement("div");
        playerElement.innerHTML = `
        <div class="classement-info">
        <span class="classement">${index + 1}-</span> 
        <span class="username">${playerData.nickName + " " + playerData.familyName}</span>
        <span class="score">: ${playerData.score}  / ${playerData.quizMaxQuestions}</span>

          </div>
        `
    playersContainer.appendChild(playerElement);
    highscoresQuizzes.appendChild(playersContainer);

    });
     data.user = users;
     array.push(data);

     let filteredArray = array.filter(obj => obj.quizName === "Arduino")[0].user;
    // console.log(filteredArray);


    quizItem.appendChild(viewQuizButton);
    quizzesContainer.appendChild(quizItem);
});

}

displayAllQuizzes();


//For the admins 

if (localStorage.getItem("admin-creds")) {
  const buttonToRemove = document.getElementById("button-to-remove");
  const buttonToRemovePhone = document.getElementById("button-to-remove-phone");
  buttonToRemove.textContent = "Admin";
  buttonToRemovePhone.textContent = "Admin";


   buttonToRemove.addEventListener("click", () => {
    window.location.href = "post_login.html"; 
  });

  buttonToRemovePhone.addEventListener("click", () => {
    window.location.href = "post_login.html"; 
  });


}


