// firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBZImZOeembB7hlqgiYcckcml53XmqBM44",
  authDomain: "srijaconsultancy-7a26e.firebaseapp.com",
  projectId: "srijaconsultancy-7a26e",
  storageBucket: "srijaconsultancy-7a26e.firebasestorage.app",
  messagingSenderId: "548247461739",
  appId: "1:548247461739:web:f2cf23ca6e329c68e8362e",
  measurementId: "G-ME3VVSQSWP"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get Auth service instance
const auth = getAuth(app);

// Export the auth instance so other modules can use it
export { auth };