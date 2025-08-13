import { auth } from "../js/firebaseInit.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

function handleLogout() {
  console.log("handle Logout");
  signOut(auth)
    .then(() => {
      // Clear session storage
      sessionStorage.clear();

      // Prevent back navigation
      history.pushState(null, null, location.href);
      window.addEventListener("popstate", () => {
        history.pushState(null, null, location.href);
      });

      // Redirect to login/home page
      window.location.replace("../index.html");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

window.handleLogout = handleLogout; // So it's available globally for the HTML `onclick`
const fetchCurrentUser = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
    } else {
      console.log("No user is signed in");
      window.location.replace("../index.html");
    }
  });
};
fetchCurrentUser();
async function fetchAndRenderCandidates() {
  try {
    const res = await fetch("https://srija-consultancy-backend-llao.onrender.com/api/candidate/fetchAllCandidates");

    if (!res.ok) {
      throw new Error(`Failed to fetch candidates: ${res.status}`);
    }

    const data = await res.json();
    const candidates = data.candidates;

    const container = document.getElementById("candidateListContainer");
    container.innerHTML = ""; // Clear existing content

    candidates.forEach((candidate) => {
      const card = document.createElement("div");
      card.className = "job-card";

      card.innerHTML = `
  <div class="candidate-card p-4 rounded shadow-sm border bg-white mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold text-primary mb-0">${candidate.name}</h5>
      <a href="${candidate.resumeURL}" class="btn btn-outline-primary btn-sm" download target="_blank">
        <i class="fas fa-download me-1"></i> Resume
      </a>
    </div>

    <div class="candidate-details mb-2">
      <p class="mb-1"><i class="fas fa-envelope text-muted me-2"></i> ${candidate.email}</p>
      <p class="mb-1"><i class="fas fa-phone text-muted me-2"></i> ${candidate.number}</p>
      <p class="mb-0"><i class="fas fa-graduation-cap text-muted me-2"></i> ${candidate.education}</p>
    </div>
  </div>
`;


      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching candidates:", error.message);
    const container = document.getElementById("candidateListContainer");
    container.innerHTML = `<p style="color: red;">Failed to load candidates.</p>`;
  }
}


fetchAndRenderCandidates();
