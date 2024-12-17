import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";



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

//Nav-links Buttons Appear :

const menuButton = document.getElementById('menu-button');
const popupNav = document.getElementById('pop-up-nav');

menuButton.addEventListener('click', () => {
  popupNav.classList.toggle('activeBar');
});


//Display the different Quizzes from the Database : 

import {getStorage, ref as sRef , uploadBytesResumable , getDownloadURL} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {storage, ISCdb, db, auth} from "../DataCenter/firebase.js"

const quizzesContainer = document.getElementById("big-container")

async function displayAllQuizzes(){
const quizzesRef = collection(ISCdb, "Quizzes");
const snapshot = await getDocs(quizzesRef);

snapshot.forEach((doc) => {
    const data = doc.data();
    const quizItem = document.createElement("div");
    quizItem.classList.add("quiz-container");



    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");


    deleteButton.addEventListener("click", async () => {
        const confirmation = confirm("Are you sure you want to delete this quiz?");
        if (confirmation) {

            const quizRef = doc.ref;
            const subcollectionQuestionsRef = collection(quizRef, "Questions");
            const snapshotQuestions = await getDocs(subcollectionQuestionsRef);

            const subcollectionUsersRef = collection(quizRef, "Players");
            const snapshotUsers = await getDocs(subcollectionUsersRef)


            snapshotQuestions.forEach(async (subDoc) => {
                await deleteDoc(subDoc.ref);
              });

              snapshotUsers.forEach(async (subDoc) => {
                await deleteDoc(subDoc.ref);
              });
              
          await deleteDoc(doc.ref);
          quizItem.remove(); 
        }
      });

    quizItem.innerHTML = `
        <img src = "${data.imgURL}"> 
        <div class="info">
        <h3 class="quiz-title">${data.quizName}</h3>
        <p class="quiz-description">${data.quizDescription}</p>
        <p class="quiz-max-questions">Number of Questions: <span class="number-of-questions">${data.questionNumber}</span></p>
        </div>

    `;
    quizzesContainer.appendChild(quizItem);
    quizItem.appendChild(deleteButton);
});
}

displayAllQuizzes();



//Add new admins system

const adminForm = document.getElementById("admin-signUp-form");
const firstNameInp = document.getElementById("first-name-input");
const lastNameInp = document.getElementById("last-name-input");
const emailInp = document.getElementById("email-input");
const passwordInp = document.getElementById("password-input");


let registerUser = evt => {
  evt.preventDefault();

  createUserWithEmailAndPassword(auth, emailInp.value, passwordInp.value)
  .then((credentials) => {
      set(ref(db, 'AdminsAuthList/' + credentials.user.uid),{
        firstname : firstNameInp.value,
        lastname : lastNameInp.value
      })

      adminForm.reset();
  })
  .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
  })
}

  adminForm.addEventListener("submit", registerUser);