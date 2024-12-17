//Display the Score on the page
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getFirestore, collection, doc as adoc, setDoc, addDoc,updateDoc, getDocs, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {storage, ISCdb, db, auth} from "../DataCenter/firebase.js"


const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const quizId = urlParams.get('id');
const userScore = localStorage.getItem('quizScore');


document.addEventListener('DOMContentLoaded', async function() {
    const scoreElement = document.getElementById('text');
    const maxQuestions = localStorage.getItem('quizMaxQuestions');
  
    if (userScore) {
      scoreElement.textContent = `${userScore} / ${maxQuestions}`;
      try {
        const usersRef = adoc(ISCdb, "Quizzes", quizId, "Players", userId);
        await updateDoc(usersRef, {
          score: parseInt(userScore), // Update the score in the Firestore document
      });
    } catch (error) {
        console.error("Error updating score:", error);
    }
    } else {
      scoreElement.textContent = 'Score not found';
    }
  });