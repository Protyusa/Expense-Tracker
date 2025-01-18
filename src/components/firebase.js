import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4fVA3M2xK4axIyCbAUxkJhS7qcYnBrK8",
  authDomain: "expense-tracker-e8699.firebaseapp.com",
  projectId: "expense-tracker-e8699",
  storageBucket: "expense-tracker-e8699.firebasestorage.app",
  messagingSenderId: "248191414997",
  appId: "1:248191414997:web:842756e380018426d8685c",
  measurementId: "G-NJL9YXD0JV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };