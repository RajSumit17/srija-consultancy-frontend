// login.js

// Import the auth object from firebase-init.js
import { auth } from "./firebaseInit.js";
// Import specific auth functions needed
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Function to handle login logic
export async function loginUser(userType) {
  // Export this function
  console.log("Login button clicked!");
  const email = document.getElementById(`email`).value; // Assuming 'email' is the ID for login email
  const password = document.getElementById(`password`).value; // Assuming 'password' is the ID for login password
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential || !userCredential.user) {
      alert("Login failed. Please check your credentials.");
      return;
    }

    const idToken = await userCredential.user.getIdToken();

    if (!idToken) {
      alert("Failed to retrieve token. Try again.");
      return;
    }

    console.log("Firebase Login Successful:", userCredential.user.email);
    console.log("ID Token:", idToken);

    const path =
      userType === "candidate"
        ? "candidate"
        : userType === "recruiter"
        ? "recruiter"
        : "admin";

    try {
      const res = await fetch(`https://srija-consultancy-backend.onrender.com/api/login/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Unknown error");
        return false;
      }
      console.log(data.name)
      alert("Login successful! "+data.name); // Only redirect after full success
      sessionStorage.setItem("name",data.name)
      sessionStorage.setItem("email",data.email)
    //   window.location.href =
    //     userType === "candidate" ? "../jobs.html" : "../jobs_recruiter_admin.html";
      return true;
    } catch (err) {
      console.error("Error while contacting backend:", err);
      alert("Backend API call failed. Check your network or backend server.");
      return false;
    }
  } catch (error) {
    console.error("Login failed:", error);

    // Normalize the error message
    if (error.code === "auth/invalid-credential") {
      alert("Incorrect email or password.");
    } else if (error.code === "auth/user-not-found") {
      alert("User not registered.");
    } else if (error.code === "auth/wrong-password") {
      alert("Wrong password.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format.");
    } else {
      alert("Login failed: " + error.message);
    }
    return false;
  }
}

// You might also want to export functions to attach listeners
// or directly attach them within this module if the elements are guaranteed to exist.
// For robust setup, better to attach listeners in index.js after DOMContentLoaded.
