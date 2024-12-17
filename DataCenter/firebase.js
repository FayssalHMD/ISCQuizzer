
import {initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {getStorage, ref as sRef , uploadBytesResumable , getDownloadURL} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import {getFirestore, doc , getDoc,getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


  const firebaseConfig = {
    apiKey: "AIzaSyCncduxgLJ0luIQjxnFlHlalg1_C4FirYs",
    authDomain: "isc-quizer.firebaseapp.com",
    databaseURL: "https://isc-quizer-default-rtdb.firebaseio.com",
    projectId: "isc-quizer",
    storageBucket: "isc-quizer.appspot.com",
    messagingSenderId: "658981286979",
    appId: "1:658981286979:web:f48b8f2658b41c38e350f6",
    measurementId: "G-J0FBK6MJ7T"
  };

 

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const ISCdb = getFirestore();
export const storage = getStorage();
export const db = getDatabase();
export const auth = getAuth(app);
export const dbref = ref(db);

