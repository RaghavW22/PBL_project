import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCKtlZQbNlh7qUnHPWxIQh8b-Y-M7tVm_Y",
  authDomain: "medical-report-analysis-e4617.firebaseapp.com",
  projectId: "medical-report-analysis-e4617",
  storageBucket: "medical-report-analysis-e4617.firebasestorage.app",
  messagingSenderId: "48178686141",
  appId: "1:48178686141:web:0109d39f384d4d0091afd4",
  measurementId: "G-RQYNM2J2TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
