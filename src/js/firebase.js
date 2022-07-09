// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9ymqFB902cWfUYI2567y0IooWhvxer3Q",
  authDomain: "corybergquist-f2d2b.firebaseapp.com",
  projectId: "corybergquist-f2d2b",
  storageBucket: "corybergquist-f2d2b.appspot.com",
  messagingSenderId: "421751727302",
  appId: "1:421751727302:web:046d7930b809d6430de3c7",
  measurementId: "G-5S6ZEV557D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
