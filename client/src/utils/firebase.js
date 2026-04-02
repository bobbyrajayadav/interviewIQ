import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-55e14.firebaseapp.com",
  projectId: "interviewiq-55e14",
  storageBucket: "interviewiq-55e14.firebasestorage.app",
  messagingSenderId: "50211586268",
  appId: "1:50211586268:web:19a0ed75a8d6faef8af419"
};

// Initialize Firebase
console.log(firebaseConfig)
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider }