import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// TODO: Replace placeholders with your actual Firebase config values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE", // User needs to provide this
    authDomain: "multivac-ai.firebaseapp.com",
    projectId: "multivac-ai",
    storageBucket: "multivac-ai.firebasestorage.app",
    messagingSenderId: "183708889456",
    appId: "YOUR_APP_ID_HERE" // User needs to provide this
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
