// In your script file (e.g., dashboard.js or main.js)
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

const jobListContainer = document.getElementById("jobListContainer");
const jobSearchInput = document.getElementById("jobSearchInput");
const jobSearchForm = document.getElementById("jobSearchForm");

const recruiterEmail = sessionStorage.getItem("email") || "default@example.com";
console.log(recruiterEmail);

// ✅ Fetch all jobs requested by this recruiter
async function fetchRequestedJobs() {
  console.log("Fetching jobs for recruiter:", recruiterEmail);
  try {
    const response = await fetch(
      `https://srija-consultancy-backend.onrender.com/api/recruiter/getJobsPosted`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recruiterEmail }),
      }
    );
    console.log("fetched the jobs requested");
    const fetchedJobs = await response.json();
    renderJobs(fetchedJobs.jobs);
  } catch (err) {
    console.error("Failed to load jobs:", err);
    jobListContainer.innerHTML =
      '<p class="text-danger">Failed to load jobs.</p>';
  }
}

// ✅ Render jobs with searchable attributes
function renderJobs(jobs) {
  if (!jobs || jobs.length === 0) {
    jobListContainer.innerHTML =
      '<p class="text-muted">No job requests found.</p>';
    return;
  }

  jobListContainer.innerHTML = "";

  jobs.forEach((job) => {
    const jobCard = document.createElement("div");
    jobCard.className =
      "list-group-item mb-3 p-3 border rounded shadow-sm job-card";

    // Add data-* attributes for search
    jobCard.dataset.title = job.jobTitle?.toLowerCase() || "";
    jobCard.dataset.description = job.description?.toLowerCase() || "";
    jobCard.dataset.vacancy = job.vacancy?.toString().toLowerCase() || "";
    jobCard.dataset.location = job.location?.toLowerCase() || "";

    jobCard.innerHTML = `
  <div class="job-card-header d-flex justify-content-between align-items-start mb-2">
    <h5 class="role mb-1">${job.jobTitle}</h5>
    <span class="badge ${
      job.status === "posted"
        ? "bg-success"
        : job.status === "pending"
        ? "bg-warning text-dark"
        : "bg-secondary"
    } text-capitalize">${job.status}</span>
  </div>

  <p class="job-description mb-2"><strong>Description:</strong> ${
    job.description
  }</p>

  <div class="job-meta d-flex flex-wrap gap-2 mb-2">
    <span class="info-tag"><i class="bi bi-people-fill me-1"></i> Vacancy: ${
      job.vacancy
    }</span>
    <span class="info-tag"><i class="bi bi-geo-alt-fill me-1"></i> ${
      job.location
    }</span>
    <span class="info-tag"><i class="bi bi-mortarboard-fill me-1"></i> ${
      job.qualification
    }</span>
    <span class="info-tag"><i class="bi bi-briefcase-fill me-1"></i> ${
      job.experience
    } experience</span>
  </div>

  <div class="d-flex gap-2 mt-3">
    <button class="btn btn-sm btn-outline-primary edit-btn" ${
      job.status === "posted" ? "disabled" : ""
    }>
      <i class="bi bi-pencil-square me-1"></i> Edit
    </button>
    <button class="btn btn-sm btn-outline-danger delete-btn" ${
      job.status === "posted" ? "disabled" : ""
    }>
      <i class="bi bi-trash me-1"></i> Delete
    </button>
  </div>
`;

    jobCard.querySelector(".edit-btn").addEventListener("click", function () {
      openEditModal(job);
    });

    jobCard
      .querySelector(".delete-btn")
      .addEventListener("click", async function () {
        const btn = this;
        if (confirm("Are you sure you want to delete this job request?")) {
          btn.disabled = true;
          btn.textContent = "Deleting...";
          await deleteJob(job.requestId);
          btn.disabled = false;
          btn.textContent = "Delete";
        }
      });

    jobListContainer.appendChild(jobCard);
  });
}

function openEditModal(job) {
  document.getElementById("editRequestId").value = job.requestId;
  document.getElementById("editTitle").value = job.jobTitle;
  document.getElementById("editDescription").value = job.description;
  document.getElementById("editVacancy").value = job.vacancy;
  document.getElementById("editLocation").value = job.location;
  document.getElementById("editQualification").value = job.qualification;
  document.getElementById("editExperience").value = job.experience;

  document.getElementById("editJobModalOverlay").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeEditModal() {
  document.getElementById("editJobForm").reset();
  document.getElementById("editJobModalOverlay").style.display = "none";
  document.body.style.overflow = "";
}
document.getElementById("editJobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updateBtn = e.submitter;
  updateBtn.disabled = true;
  updateBtn.textContent = "Updating...";

  const jobId = document.getElementById("editRequestId").value;
  const updatedData = {
  jobTitle: document.getElementById("editTitle").value.trim(),
  description: document.getElementById("editDescription").value.trim(),
  vacancy: parseInt(document.getElementById("editVacancy").value),
  qualification: document.getElementById("editQualification").value.trim(),
  experience: document.getElementById("editExperience").value.trim(),
  location: document.getElementById("editLocation").value.trim(),
};
  console.log(updatedData.jobTitle)

  await updateJob(jobId, updatedData);

  updateBtn.disabled = false;
  updateBtn.textContent = "Update";
  closeEditModal();
});

// ✅ Update job
async function updateJob(jobId, updatedData) {
  try {
    const email = recruiterEmail;
    console.log(jobId, email);
    const response = await fetch(
      `https://srija-consultancy-backend.onrender.com/api/recruiter/updateJob`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          updatedData,
          email,
        }),
      }
    );

    if (response.ok) {
      fetchRequestedJobs();
    } else {
      alert("Failed to update job.");
    }
  } catch (err) {
    console.error("Error updating job:", err);
  }
}

// ✅ Delete job
async function deleteJob(jobId) {
  try {
    const response = await fetch(
      `https://srija-consultancy-backend.onrender.com/api/recruiter/deleteJob`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recruiterEmail, requestId: jobId }),
      }
    );

    if (response.ok) {
      fetchRequestedJobs();
    } else {
      alert("Failed to delete job.");
    }
  } catch (err) {
    console.error("Error deleting job:", err);
  }
}

// ✅ Improved Search Functionality (local filter, no extra API call)
jobSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = jobSearchInput.value.trim().toLowerCase();

  document.querySelectorAll(".job-card").forEach((card) => {
    const title = card.dataset.title;
    const desc = card.dataset.description;
    const vacancy = card.dataset.vacancy;
    const location = card.dataset.location;

    const match =
      title.includes(query) ||
      desc.includes(query) ||
      vacancy.includes(query) ||
      location.includes(query);

    card.style.display = !query || match ? "" : "none";
  });
});

// ✅ Live filter while typing
jobSearchInput.addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();

  document.querySelectorAll(".job-card").forEach((card) => {
    const title = card.dataset.title;
    const desc = card.dataset.description;
    const vacancy = card.dataset.vacancy;
    const location = card.dataset.location;

    const match =
      title.includes(query) ||
      desc.includes(query) ||
      vacancy.includes(query) ||
      location.includes(query);

    card.style.display = !query || match ? "" : "none";
  });
});

// ✅ Job request form handling
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobRequestForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jobData = {
      email: recruiterEmail,
      jobTitle: document.getElementById("jobTitle").value.trim(),
      description: document.getElementById("jobDescription").value.trim(),
      vacancy: parseInt(document.getElementById("jobVacancy").value),
      location: document.getElementById("jobLocation").value.trim(),
      qualification: document.getElementById("jobQualification").value.trim(),
      experience: document.getElementById("jobExperience").value.trim(),
    };

    try {
      const response = await fetch(
        "https://srija-consultancy-backend.onrender.com/api/recruiter/requestJobPosting",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Job posting request submitted successfully!");
        form.reset();
        fetchRequestedJobs();
        document.getElementById("addJobModalOverlay").style.display = "none";
        document.body.style.overflow = "";
      } else {
        alert(`Error: ${result.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Error submitting job request:", error);
      alert("An unexpected error occurred.");
    }
  });
});

// ✅ Initial fetch
fetchRequestedJobs();
fetchCurrentUser();
