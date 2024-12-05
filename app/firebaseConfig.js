import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
 
const firebaseConfig = {
    apiKey: "AIzaSyBhPVnIO2JqGbJQP_ABq8EISfCxekvuNd0",
    authDomain: "fork-3e3e1.firebaseapp.com",
    projectId: "fork-3e3e1",
    storageBucket: "fork-3e3e1.firebasestorage.app",
    messagingSenderId: "411008743232",
    appId: "1:411008743232:web:a533249c29d388e9fe6ca5",
    measurementId: "G-6EKJXZJM17"
};
 
const app =initializeApp(firebaseConfig);
const db =  getFirestore(app);
 
export {db};