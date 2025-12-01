import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSqM7xrB7Hvo3EEe4dxd2lPbT94rRu4vk",
  authDomain: "health-booking-system-b1d9b.firebaseapp.com",
  projectId: "health-booking-system-b1d9b",
  storageBucket: "health-booking-system-b1d9b.firebasestorage.app",
  messagingSenderId: "811929469296",
  appId: "1:811929469296:web:d8345e163df93ddf8d0fb5",
  measurementId: "G-KSL3CSD2EX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();