// category.js
import {LOCAL_API_URL,API_URL} from "./URL.js"
const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const jobListContainer = document.querySelector(".job-list");
document.getElementById("categoryHeading").textContent = `${category} Jobs`;
import { Notyf } from "https://cdn.skypack.dev/notyf";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";

const db = getFirestore();
export const candidateDetails = {
  name: "",
  email: "",
  number: "",
  id: "",
  jobs:[],
  resume: null,
  education: ""
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
    fetchJobs();
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
 const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });
const fetchJobs = async () => {
  try {
    // http://localhost:8080
    // https://srija-consultancy-backend.onrender.com
    const res = await fetch(`${API_URL}/api/jobs/getJobByCategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category, candidateId: candidateDetails.id }),
    }); // Local JSON file
    if (!res.ok) throw new Error("Failed to load jobs data.");
    // notyf.success("Jobs loaded successfully!");
    const data = await res.json();
    // console.log(data);
    const jobs = data[category] || [];
    renderJobs(data);
  } catch (error) {
    console.error("Error fetching job data:", error);
    jobListContainer.innerHTML = `<p>Failed to load jobs.</p>`;
  }
};

const renderJobs = (jobs) => {
  jobListContainer.innerHTML = ""; // Clear before rendering
  if (jobs.length === 0) {
    jobListContainer.innerHTML = `<p>No jobs found in this category.</p>`;
    return;
  }

  jobs.forEach((job) => {
  const jobCard = document.createElement("div");
  jobCard.className =
    "job-card mb-4 p-4 rounded shadow-sm border border-1 bg-light";

  jobCard.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-2">
      <h4 class="text-primary mb-1">${job.title}</h4>
    </div>
    <p class="mb-1"><em>${job.company}</em></p>
    <p class="mb-1"><strong>Location:</strong> ${job.location}</p>
    <p class="mb-1"><strong>Experience:</strong> ${job.experience}</p>
    <p class="mb-1"><strong>Salary:</strong> ${job.salary}</p>
    <p class="mb-1"><strong>Type:</strong> ${job.jobType}</p>
    <p class="mb-1"><strong>Vacancy:</strong> ${job.vacancy}</p>
    <p class="mb-1"><strong>Qualification:</strong> ${job.qualification}</p>
    <p class="mb-3"><strong>Description:</strong> ${job.description}</p>

    <div class="d-flex justify-content-end">
      <button class="btn btn-outline-primary btn-sm interested-btn">
        <i class="bi bi-hand-thumbs-up me-1"></i> Interested
      </button>
    </div>
  `;

  const interestBtn = jobCard.querySelector(".interested-btn");
  interestBtn.addEventListener("click", () => {
    showInterest(job.id, job.jobCategory); // Your handler
  });

  jobListContainer.appendChild(jobCard);
});

};

const showInterest = async (jobId, jobCategory) => {
  const loader = document.getElementById("loaderOverlay");
  try {
    // Show loader
    loader.style.display = "flex";

    // candidateDetails.email = "rajsumit1793@gmail.com";

    const res = await fetch(`${API_URL}/api/apply/notify-interest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId, jobCategory, email: candidateDetails.email }),
    });

    if (!res.ok) throw new Error("Failed to mark interest.");
    // console.log("Interest marked successfully!");
    const data = await res.json();
    notyf.success("Marked as interested successfully!");
  } catch (error) {
    console.error("Error marking interest:", error);
    notyf.error("Error marking interest.");
  } finally {
    // Hide loader
    fetchJobs(); // Refresh job list
    loader.style.display = "none";
  }
};

// const renderCandidateProfile = () =>{
//   const {
//     name,
//     email,
//     number,
//     jobs,
//     resume,
//     education
//   } = candidateDetails;

//   const profileHTML = `
//     <div class="card shadow-lg border-0 rounded-4 mx-auto" style="max-width: 750px;">
//       <!-- Header with icon -->
//       <div class="card-header bg-primary text-white text-center rounded-top-4 position-relative py-4">
//         <div class="profile-pic bg-white text-primary rounded-circle border border-3 border-white d-flex align-items-center justify-content-center mx-auto mb-2"
//              style="width: 90px; height: 90px; font-size: 40px;">
//           <i class="fas fa-user"></i>
//         </div>
//         <h3 class="mb-0">${name || "N/A"}</h3>
//         <small>${education || "Not specified"}</small>
//       </div>

//       <!-- Body -->
//       <div class="card-body px-4 py-4">
//         <div class="row mb-3">
//           <div class="col-md-6">
//             <strong>Email:</strong>
//             <p class="text-muted mb-0">${email || "N/A"}</p>
//           </div>
//           <div class="col-md-6">
//             <strong>Contact:</strong>
//             <p class="text-muted mb-0">${number || "N/A"}</p>
//           </div>
//         </div>

//         <div class="mb-3">
//           <strong>Interested Jobs:</strong>
//           <div class="border rounded p-3 bg-light" style="max-height: 150px; overflow-y: auto;">
//             <ul class="mb-0 ps-3 small text-dark">
//               ${jobs && jobs.length > 0
//                 ? jobs.map(job => `<li>${job}</li>`).join("")
//                 : "<li>No jobs listed</li>"}
//             </ul>
//           </div>
//         </div>

//         <div class="mb-3">
//           <strong>Resume:</strong><br />
//           ${
//             resume
//               ? `<a href="${resume}" target="_blank" class="btn btn-outline-primary btn-sm mt-2">
//                   <i class="fas fa-file-alt me-1"></i> View Resume
//                  </a>`
//               : "<p class='text-muted mt-2'>Not uploaded</p>"
//           }
//         </div>
//       </div>

//       <!-- Footer -->
//       <div class="card-footer text-end bg-white border-0">
//         <button class="btn btn-secondary d-print-none" onclick=${closeProfile}>Close</button>
//       </div>
//     </div>
//   `;

//   document.getElementById("candidate-profile").innerHTML = profileHTML;
// }
// function closeProfile() {
//   document.getElementById("candidate-profile").innerHTML = "";
// }
// Store delete data temporarily
let deleteJobData = { uniqueId: null, category: null, cardElement: null };

const showDeleteDialog = (uniqueId, category, cardElement) => {
  deleteJobData = { uniqueId, category, cardElement };
  document.getElementById("deleteConfirmModal").style.display = "flex";
};

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  const { uniqueId, category, cardElement } = deleteJobData;
  document.getElementById("deleteConfirmModal").style.display = "none";

  try {
    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/deleteJob", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uniqueId, category }),
    });

    if (!res.ok) throw new Error("Failed to delete job");

    cardElement.remove();
    notyf.success("Job deleted successfully!");
  } catch (err) {
    console.error("Delete failed:", err);
    notyf.error("Error deleting job.")
  }
});

document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
  document.getElementById("deleteConfirmModal").style.display = "none";
});



// renderCandidateProfile();