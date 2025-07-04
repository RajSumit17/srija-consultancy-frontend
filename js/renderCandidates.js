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
  const res = await fetch(
    "https://srija-consultancy-backend.onrender.com/api/candidate/fetchAllCandidates"
  );
  const data = await res.json(); // assuming { candidates: [...] }
  const candidates = data.candidates;
  console.log(candidates);
  const container = document.getElementById("candidateListContainer");
  // container.innerHTML = `<h1>Candidates</h1>`; // reset list

  candidates.forEach((candidate) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
  <div class="candidate-name">${candidate.name}</div>

  <div class="candidate-info">
    <div class="info-item">
      <i class="fas fa-envelope"></i> ${candidate.email}
    </div>
    <div class="info-item">
      <i class="fas fa-phone"></i> ${candidate.number}
    </div>
    <div class="info-item">
      <i class="fas fa-graduation-cap"></i> ${candidate.education}
    </div>
  </div>

  <div class="resume-section">
    <div class="section-title">Resume</div>
    <a href="${candidate.resumeURL}" class="download-btn" download target="_blank">
      <i class="fas fa-download me-1"></i> Download Resume
    </a>
  </div>
`;

    container.appendChild(card);
  });
}

fetchAndRenderCandidates();
