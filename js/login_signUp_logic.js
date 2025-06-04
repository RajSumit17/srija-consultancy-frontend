// index.js

// Import functions from your separate modules
import { loginUser } from "./login.js";
import { signupCandidate, signupRecruiter } from "./signUp.js"; // Assuming you have a signup form in index.html

// Ensure the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
  // --- Login Form Event Listener ---
  const adminLoginBtn = document.getElementById("login_btn");
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const userEmail = document.getElementById("email").value;
      const userType = document.getElementById("userType").value;

      if (userEmail == "sumitraj1533@gmail.com") {
        const success = await loginUser("admin");
        if (success) {
          window.location.replace("../admin_layouts/admin_jobs.html");
        }
      } else if (userType == "candidate") {
        const success = await loginUser("candidate");
        if (success) {
          window.location.replace("../candidate_layouts/candidate_jobs.html");
        }
      } else {
        const success = await loginUser("recruiter");
        if (success) {
          window.location.replace("../recruiter_layouts/recruiter_jobs.html");
        }
      }
    });
    console.log("Login button listener attached.");
  } else {
    console.warn(
      "Login button (ID 'loginBtn') not found. Is your HTML correct?"
    );
  }

  const candidateLoginBtn = document.getElementById("candidateLogin");
  if (candidateLoginBtn) {
    candidateLoginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const success = await loginUser("candidate");
      if (success) {
        window.location.replace("../candidate_layouts/candidate_jobs.html");
      }
    });
    console.log("Login button listener attached.");
  } else {
    console.warn(
      "Login button (ID 'loginBtn') not found. Is your HTML correct?"
    );
  }

  const recruiterLoginBtn = document.getElementById("recruiterLogin");
  if (recruiterLoginBtn) {
    recruiterLoginBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const success = await loginUser("recruiter");
      if (success) {
        window.location.replace("../recruiter_layouts/recruiter_jobs.html")
      }
    });
    console.log("Login button listener attached.");
  } else {
    console.warn(
      "Login button (ID 'loginBtn') not found. Is your HTML correct?"
    );
  }

  // --- Signup Form Event Listener (if you have one in the same HTML) ---
  const candidateSignupBtn = document.getElementById("candidateSignupBtn");
  if (candidateSignupBtn) {
    candidateSignupBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const success = await signupCandidate();
      if (success) 
      window.location.replace("../candidate_layouts/candidate_jobs.html")
    });
    console.log("Signup button listener attached.");
  } else {
    // console.warn("Signup button (ID 'signupBtn') not found. If you have a separate signup page, ignore this warning.");
  }
  const recruiterSignupBtn = document.getElementById("recruiterSignupBtn");
  if (recruiterSignupBtn) {
    recruiterSignupBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const success = await signupRecruiter();
      if (success)
      window.location.replace("../recruiter_layouts/recruiter_jobs.html")
    });
    console.log("Signup button listener attached.");
  } else {
    // console.warn("Signup button (ID 'signupBtn') not found. If you have a separate signup page, ignore this warning.");
  }
});
