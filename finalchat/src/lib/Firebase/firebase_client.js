// Import the functions you need from the SDKs you need
import { deleteApp, getApps,getApp ,initializeApp } from "firebase/app";
import {getAuth, setPersistence , inMemoryPersistence} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX_f_nbBSphEyxT2IxxMcKdRr8S_MWEDY",
  authDomain: "multilingualloanadvisor.firebaseapp.com",
  projectId: "multilingualloanadvisor",
  storageBucket: "multilingualloanadvisor.firebasestorage.app",
  messagingSenderId: "510882625715",
  appId: "1:510882625715:web:570c64e7d8f639ddd818c6",
  measurementId: "G-F8BF0D6T41"
};

// Initialize Firebase
let firebaseApp;
if (!getApps().length){
    firebaseApp = initializeApp (firebaseConfig)
}
else{
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig)
}



export const auth = getAuth(firebaseApp)