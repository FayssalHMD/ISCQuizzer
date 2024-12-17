import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {getStorage, ref as sRef , uploadBytesResumable , getDownloadURL} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import { getFirestore, collection, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {storage, ISCdb} from "../DataCenter/firebase.js"


//Image Part :
const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imgView = document.getElementById("img-view");
const nextButtonQuizInfo = document.getElementById("toTheInfo");


if(imgView.style.backgroundImage !== "none"){
    nextButtonQuizInfo.disabled = true;
}


inputFile.addEventListener("change", insertImage);

function insertImage(){
    inputFile.files[0];
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imgView.style.backgroundImage = `url(${imgLink})`;
    imgView.querySelector('p').style.display = 'none'; // Hide the paragraph
    imgView.querySelector('span').style.display = 'none'; // Hide the span
    imgView.querySelector('img').style.display ='none';
    imgView.style.border = "none";
    nextButtonQuizInfo.disabled = false;
}

// Drag and Drop Functionality

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
})
dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    insertImage();
    
})

//Information of the quiz form :

const quizForm = document.getElementById("quiz-info-form");
let imgURL = "";

nextButtonQuizInfo.addEventListener("click", (e) => {
    e.preventDefault();
    dropArea.style.display = "none";
    quizForm.style.display = "block";

    uploadImage();
})


//Image to the firebase Storage :

async function uploadImage(){
    const file = inputFile.files[0];
    const storageRef = sRef(storage, "Images/"+ file.name);
    const uploadTask = uploadBytesResumable(storageRef,file);



    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
        alert("Fail to update the image : ",error);
    },
    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("You can find the URL :"+ downloadURL);
            imgURL = downloadURL; 
        })
    })
}

//Quiz Form collection Data : 
const toTheQuestionsButton = document.getElementById("toTheQuestions");
const questionsForm = document.getElementById("quiz-quiestions-info");


//Update the questions form Dynamically :

const questionsButton = document.getElementById("next-question");
const currentQuestionText = document.getElementById("question-number-text");
let currentQuestion = 1;

      
function UpdateQuestionNumber(){
    if(currentQuestion >= 10){
        currentQuestionText.innerHTML = currentQuestion;
    }else{
        currentQuestionText.innerHTML = `0${currentQuestion}`;
    }
}

UpdateQuestionNumber();


let maxQuestion;



quizForm.addEventListener("submit",(e)=>{
    e.preventDefault();


   const quizFormData = Object.fromEntries(new FormData(quizForm).entries());
   
   quizFormData.imgURL = imgURL;
   maxQuestion = quizFormData.questionNumber;


    quizForm.style.display = "none";
    questionsForm.style.display = "block";


    const quizInfoRef = doc(ISCdb, "Quizzes" , quizFormData.quizName);

    async function quizToFirestore() {
      
        const quizInfoData = await setDoc(quizInfoRef, quizFormData)
          .then(() => {
          })
          .catch((error) => {
            alert("Error occured :" + error);
          });
      }
      

   quizToFirestore();



      
//Add the questions : 
questionsForm.addEventListener("submit" ,(e) => {
    e.preventDefault();

     //Reading the questions and answers from the second form.
        const questionFormData = Object.fromEntries(new FormData(questionsForm).entries());
    
        //Adding a new subcollection

        const questionInfoRef = collection(quizInfoRef, "Questions");
        const customIdRef = `Question${currentQuestion}`;
        const newQuestionDocRef = doc(questionInfoRef, customIdRef);


        async function addQuestions(){
    
    
            try{
                  await setDoc(newQuestionDocRef, questionFormData);

                   currentQuestion++;
                   questionsForm.reset();
                   UpdateQuestionNumber();


                   if(currentQuestion == maxQuestion){
                    questionsButton.innerHTML = "Submit";
                    }else 
                    if(currentQuestion > maxQuestion){
                      questionsForm.style.display = "none";

                       const waitPage = document.createElement("div");

                       waitPage.id = 'wait-page';
                       waitPage.textContent = 'Please wait...';

                       document.body.appendChild(waitPage);

                       setTimeout(() => {
                           window.location.href = "/Main Pages/post_login.html";

                       },2000);

                    }
                         }
                
               catch(error){
            alert("An error occurred while adding your questions :" + error);
    }

        };

        addQuestions();
})


})
