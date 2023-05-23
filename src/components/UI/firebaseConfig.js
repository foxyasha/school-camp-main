import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import "toastify-js/src/toastify.css"
import ValidData from "../../ValidData";

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



const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        ValidData('Success', true)
    }
    catch (error) {
        const errorCode = error.code;
        console.log(errorCode);
        if(errorCode == 'auth/missing-email')
            return ValidData('Fill email field!', false);
        if(errorCode == 'auth/invalid-email')
            return ValidData('Invalid email', false);
        if(errorCode == 'auth/user-not-found')
            return ValidData('User not found', false);
        if(errorCode == 'auth/too-many-requests')
            return ValidData('Too many requests, try again later', false);
    }

};


export {
    sendPasswordReset,
};