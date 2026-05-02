// Firebase configuration – Election Assistant project
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDHxet3y24XCZYfH14fRyRa7ClCGoUjdP8",
  authDomain: "election-assistant-63b68.firebaseapp.com",
  projectId: "election-assistant-63b68",
  storageBucket: "election-assistant-63b68.firebasestorage.app",
  messagingSenderId: "649590099381",
  appId: "1:649590099381:web:5cc06828dcd080b6ba9dfc",
  measurementId: "G-1RQ0X0KNSJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics only in browser environments (avoids SSR / build errors)
isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

export default app;
