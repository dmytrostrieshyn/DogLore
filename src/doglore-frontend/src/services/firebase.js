// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA0RQSoXY9QB5dDkFEOHfLXv-J6GaBAFu8",
    authDomain: "doglore-edc61.firebaseapp.com",
    projectId: "doglore-edc61",
    storageBucket: "doglore-edc61.firebasestorage.app",
    messagingSenderId: "9903479107",
    appId: "1:9903479107:web:1bf99ad885421ee31db7f6",
    measurementId: "G-PEBV8R69B8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);