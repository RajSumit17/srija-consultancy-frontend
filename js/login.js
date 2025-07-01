// login.js

// Import the auth object from firebase-init.js
import { auth } from "./firebaseInit.js";
// Import specific auth functions needed
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { Notyf } from "https://cdn.skypack.dev/notyf";
// Function to handle login logic
export async function loginUser(userType,email,password) {
  // Export this function
  console.log("Login button clicked!",userType);
  const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });

  // const email = document.getElementById(`email`).value; // Assuming 'email' is the ID for login email
  // const password = document.getElementById(`password`).value; // Assuming 'password' is the ID for login password
  if (!email || !password) {
    notyf.error("Please enter both email and password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential || !userCredential.user) {
      notyf.error("Login failed. Please check your credentials.");
      return;
    }

    const idToken = await userCredential.user.getIdToken();

    if (!idToken) {
      notyf.error("Failed to retrieve token. Try again.");
      return;
    }

    const path =
      userType === "candidate"
        ? "candidate"
        : userType === "recruiter"
        ? "recruiter"
        : "admin";

    try {
      const localURL = "http://localhost:8080";
      const renderURL = "https://srija-consultancy-backend.onrender.com";
      const res = await fetch(`${localURL}/api/login/${path}`, {
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
      console.log(data.name);
      notyf.success("Login successful!");

      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("email", data.email);
      //   window.location.href =
      //     userType === "candidate" ? "../jobs.html" : "../jobs_recruiter_admin.html";
      return true;
    } catch (err) {
      console.error("Error while contacting backend:", err);
      notyf.error("Something went wrong!");

      // alert("Backend API call failed. Check your network or backend server.");
      return false;
    }
  } catch (error) {
    console.error("Login failed:", error);

    // Normalize the error message
    if (error.code === "auth/invalid-credential") {
      notyf.error("Incorrect email or password.");
    } else if (error.code === "auth/user-not-found") {
      notyf.error("User not registered.");
    } else if (error.code === "auth/wrong-password") {
      notyf.error("Wrong password.");
    } else if (error.code === "auth/invalid-email") {
      notyf.error("Invalid email format.");
    } else {
      notyf.error("Login failed: " + error.message);
    }
    return false;
  }
}

// You might also want to export functions to attach listeners
// or directly attach them within this module if the elements are guaranteed to exist.
// For robust setup, better to attach listeners in index.js after DOMContentLoaded.
