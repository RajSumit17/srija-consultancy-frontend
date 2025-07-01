// signup.js

// Import the auth object from firebase-init.js
import { auth } from "./firebaseInit.js";
// Import specific auth functions needed
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { Notyf } from "https://cdn.skypack.dev/notyf";

// Function to handle signup logic
export async function signupCandidate() {
  // Export this function
  const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });
  const email = document.getElementById("candidate-signup-email").value;
  const password = document.getElementById("candidate-signup-password").value;
  const cnfPassword = document.getElementById(
    "candidate-signup-confirm-password"
  ).value;
  const name = document.getElementById("candidate-signup-name").value;
  const education = document.getElementById("candidate-signup-education").value;
  const number = document.getElementById("candidate-signup-number").value;
  const filePath = document.getElementById("candidate-signup-resume");
  if (!email || !password) {
    notyf.error("Please enter both email and password for registration.");
    return;
  }
  if (cnfPassword != password) {
    notyf.error("Password Does not match");
    return;
  }
  const resume = filePath.files[0];
  if (!resume) {
    notyf.error("Please select a file!");
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Firebase user created:", userCredential.user.email);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("number", number);
    formData.append("education", education);
    formData.append("resume", resume);

    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/signup/candidate", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      notyf.error("Something went wrong");
      return false;
    }

    notyf.success("Registration successful! Welcome " + name);

    // Optional: Get ID token immediately if you need to send it to your backend after signup
    const idToken = await userCredential.user.getIdToken();
    console.log("ID Token after signup:", idToken);
    return true;
  } catch (error) {
    console.error("Signup failed:", error);
    notyf.error(error.message);
    return false;
  }
}

// recruiter signUp code

export const signupRecruiter = async () => {
   const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });
  const companyName = document.getElementById("recruiter-signup-company").value;
  const contactPersonName = document.getElementById("recruiter-signup-contact").value;
  const email = document.getElementById("recruiter-signup-email").value;
  const number = document.getElementById("recruiter-signup-phone").value;
  const password = document.getElementById("recruiter-signup-password").value;
  const cnfPassword = document.getElementById("recruiter-signup-confirm-password").value;

  if (!companyName || !contactPersonName || !email || !number || !password || !cnfPassword) {
    notyf.error("Please fill all the details");
    return;
  }

  if (password !== cnfPassword) {
    notyf.error("Password does not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Firebase user created:", userCredential.user.email);

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("contactPersonName", contactPersonName);
    formData.append("email", email);
    formData.append("number", number);
    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/signup/recruiter", {
      method: "POST",
      body: formData,
    });

    const resData = await res.json();
    if (!res.ok) {
      notyf.error(resData.message || "Something went wrong");
      return false;
    }

    notyf.success("Registration successful! Welcome " + companyName);
    return true;
  } catch (error) {
    notyf.error(error.message);
    return false;
  }
};
