import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import "toastify-js/src/toastify.css"

const firebaseConfig = {
    apiKey: "AIzaSyCh2nZ507cxOVI1jYue-KOB3Uf3nVeYyk0",
    authDomain: "school-camp.firebaseapp.com",
    projectId: "school-camp",
    storageBucket: "school-camp.appspot.com",
    messagingSenderId: "693127939645",
    appId: "1:693127939645:web:e46d735f9a0f8f9988cc54",
    measurementId: "G-YYQGZTGDLK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
export const db = getFirestore(app)
export const storage = getStorage(app);


