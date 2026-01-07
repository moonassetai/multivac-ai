import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPoqmk7WWb06MjxtZU14bQTEF6lt8K_a0",
    authDomain: "multivac-ai.firebaseapp.com",
    projectId: "multivac-ai",
    storageBucket: "multivac-ai.firebasestorage.app",
    messagingSenderId: "183708889456",
    appId: "1:183708889456:web:16dfe92122d73a58059fb5",
    measurementId: "G-ENJ67769HW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleProvider, signInWithPopup, signOut, analytics };
