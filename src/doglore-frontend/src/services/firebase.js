import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA0RQSoXY9QB5dDkFEOHfLXv-J6GaBAFu8",
    authDomain: "doglore-edc61.firebaseapp.com",
    projectId: "doglore-edc61",
    storageBucket: "doglore-edc61.firebasestorage.app",
    messagingSenderId: "9903479107",
    appId: "1:9903479107:web:1bf99ad885421ee31db7f6",
    measurementId: "G-PEBV8R69B8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);