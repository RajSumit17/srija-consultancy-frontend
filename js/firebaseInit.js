// firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB4JxJk7dPWXuv3sY4mbXY0Xw448PpkBAI",
    authDomain: "srija-consultancy.firebaseapp.com",
    projectId: "srija-consultancy",
    appId: "1:380870370274:web:a6fb0dd0dc4535aca10fbb",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Get Auth service instance
const auth = getAuth(app);

// Export the auth instance so other modules can use it
export { auth };