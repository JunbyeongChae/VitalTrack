import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import  { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCBxz663JdgzRXR2nZDJmQuqxBUJTytSKo",
    authDomain: "jwj742204-kosmo.firebaseapp.com",
    databaseURL: "https://jwj742204-kosmo-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jwj742204-kosmo",
    storageBucket: "jwj742204-kosmo.firebasestorage.app",
    messagingSenderId: "508091457064",
    appId: "1:508091457064:web:242ccf56106435c26d5f1d"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase Auth 인스턴스 가져오기
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
