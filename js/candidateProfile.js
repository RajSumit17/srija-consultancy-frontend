import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
let recruiterEmail;
const db = getFirestore();
export const candidateDetails = {
  name: "",
  email: "",
  number: "",
  id: "",
  jobs: [],
  resume: null,
  education: "",
};
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      console.log("Candidate Email:", user.email);

      // Use query instead of assuming email is the doc ID
      const q = query(
        collection(db, "candidates"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const candidateDoc = querySnapshot.docs[0].data();
        const name = candidateDoc.name;
        candidateDetails.jobs = candidateDoc.interestedJobs || [];
        candidateDetails.resume = candidateDoc.resumeURL || null;
        candidateDetails.education = candidateDoc.education || "";
        candidateDetails.id = querySnapshot.docs[0].id; // Get the document ID
        candidateDetails.name = name;
        // console.log("Candidate Name:", name);
        candidateDetails.email = user.email;
        candidateDetails.number = candidateDoc.number;
        const nameEl = document.getElementById("userFirstName");
        const headerEl = document.getElementById("dropdownHeader");
        recruiterEmail = user.email; // Store the email for later use
        if (nameEl) nameEl.innerText = name;
        if (headerEl) {
          headerEl.innerHTML = `
      Welcome, ${name}
      <br><span class="text-muted fw-normal" style="font-size: 0.85rem">Candidate</span>
    `;
          renderCandidateProfile(); // Call the function to render the profile
        }
      } else {
        console.warn("No candidate found with email:", user.email);
      }
    } catch (err) {
      console.error("Error fetching candidate name:", err);
    }
  } else {
    console.log("User is not logged in.");
  }
});

function renderCandidateProfile() {
//   console.log("Rendering candidate profile with details:", candidateDetails);

  const { name, email, number, jobs, resume, education } = candidateDetails;

  const profileHTML = `
    <div class="card shadow-lg border-0 rounded-4 mx-auto" style="max-width: 750px;">
      <div class="card-header bg-primary text-white text-center rounded-top-4 position-relative py-4">
        <div class="profile-pic bg-white text-primary rounded-circle border border-3 border-white d-flex align-items-center justify-content-center mx-auto mb-2"
             style="width: 90px; height: 90px; font-size: 40px;">
          <i class="fas fa-user"></i>
        </div>
        <h3 class="mb-0 text-white">${name || "N/A"}</h3>
        <small>${education || "Not specified"}</small>
      </div>

      <div class="card-body px-4 py-4">
        <div class="row mb-3">
          <div class="col-md-6">
            <strong>Email:</strong>
            <p class="text-gray-500 mb-0">${email || "N/A"}</p>
          </div>
          <div class="col-md-6">
            <strong>Contact:</strong>
            <p class="text-gray-500 mb-0">${number || "N/A"}</p>
          </div>
        </div>
<div class="mb-3">
  <strong>Interested Jobs:</strong>
  <div class="border rounded p-3 bg-light" style="max-height: 150px; overflow-y: auto;">
    <ul class="mb-0 ps-3 small text-dark list-unstyled">
      ${
        jobs?.length
          ? jobs
              .map(
                (job) => `
          <li class="mb-2">
            <div><strong>${job.title}</strong></div>
            <div class="text-muted small">${job.company}</div>
          </li>
        `
              )
              .join("")
          : "<li>No jobs listed</li>"
      }
    </ul>
  </div>
</div>


        <div class="mb-3">
          <strong>Resume:</strong><br />
          ${
            resume
              ? `<a href="${resume}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">
                  <i class="fas fa-file-alt me-1"></i> View Resume
                </a>`
              : "<p class='text-muted mt-2'>Not uploaded</p>"
          }
        </div>
      </div>
    </div>
  `;

  document.getElementById("candidate-profile").innerHTML = profileHTML;
}
