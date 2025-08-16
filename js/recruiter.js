// fetchRecruiterName.js
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./firebaseInit.js";
import { LOCAL_API_URL, API_URL } from "../js/URL.js";
import { Notyf } from "https://cdn.skypack.dev/notyf";
const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });
let recruiterEmail;
const db = getFirestore();
const partnerDetails = {
  contactPersonName: "",
  companyName: "",
  email: "",
  number: "",
};
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      console.log("Recruiter Email:", user.email);

      // Use query instead of assuming email is the doc ID
      const q = query(
        collection(db, "recruiters"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const recruiterDoc = querySnapshot.docs[0].data();
        const name = recruiterDoc.contactPersonName;
        const companyName = recruiterDoc.companyName;
        partnerDetails.contactPersonName = name;
        partnerDetails.companyName = companyName;
        partnerDetails.email = user.email;
        partnerDetails.number = recruiterDoc.number;
        const nameEl = document.getElementById("userFirstName");
        const headerEl = document.getElementById("dropdownHeader");
        recruiterEmail = user.email; // Store the email for later use
        if (nameEl) nameEl.innerText = name;
        if (headerEl) {
          headerEl.innerHTML = `
      Welcome, ${name}
      <br><span class="text-muted fw-normal" style="font-size: 0.85rem">${companyName}</span>
    `;
          fetchRequestedJobs();
        }
      } else {
        console.warn("No recruiter found with email:", user.email);
      }
    } catch (err) {
      console.error("Error fetching recruiter name:", err);
    }
  } else {
    console.log("User is not logged in.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobRequestForm");
  const submitRequest = document.getElementById("submitRequest");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Submitting job request...");
    submitRequest.disabled = true;
    submitRequest.textContent = "Submitting...";
    const jobData = {
      jobTitle: form.jobTitle.value.trim(),
      category: form.category.value,
      jobType: form.jobType.value,
      experience: form.experience.value.trim(),
      qualification: form.qualification.value.trim(),
      location: form.location.value.trim(),
      salary: form.salary.value.trim(),
      vacancy: parseInt(form.vacancy.value),
      description: form.description.value.trim(),
      recruiter: partnerDetails, // Attach recruiter data here
      requestedAt: new Date().toISOString(), // optional: add timestamp
    };

    try {
      const response = await fetch(
        "https://srija-consultancy-backend-llao.onrender.com/api/recruiter/requestJobPosting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        notyf.success("Job request submitted successfully!");
        form.reset(); // Clear form
      } else {
        console.error(result);
        notyf.error("Failed to submit job request.");
      }
    } catch (error) {
      console.error("Error submitting job request:", error);
      notyf.error("Something went wrong.");
    } finally {
      submitRequest.disabled = false;
      submitRequest.textContent = "Submit Request";
    }
  });
});

const jobListContainer = document.getElementById("categoryContainer");
const jobSearchInput = document.getElementById("jobSearchInput");
const jobSearchForm = document.getElementById("jobSearchForm");

// const recruiterEmail = partnerDetails.email || "default@example.com";
// console.log(recruiterEmail);

// ✅ Fetch all jobs requested by this recruiter
async function fetchRequestedJobs() {
  console.log("Fetching jobs for recruiter:", recruiterEmail);
  try {
    const response = await fetch(`${API_URL}/api/recruiter/getJobsPosted`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: recruiterEmail }),
    });
    console.log("fetched the jobs requested");
    const fetchedJobs = await response.json();
    console.log("Fetched Jobs:", fetchedJobs);
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
    jobCard.className = "card mb-4 border-0 shadow-sm job-card";
    jobCard.style.cssText = `
      transition: all 0.3s ease;
      border-radius: 12px !important;
      overflow: hidden;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    `;

    // Hover effect
    jobCard.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
    });

    jobCard.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    });

    // Add searchable data attributes
    jobCard.dataset.title = job.jobTitle?.toLowerCase() || "";
    jobCard.dataset.description = job.description?.toLowerCase() || "";
    jobCard.dataset.vacancy = job.vacancy?.toString().toLowerCase() || "";
    jobCard.dataset.location = job.location?.toLowerCase() || "";

    jobCard.innerHTML = `
      <div class="card-body p-4">
        <div class="job-card-header d-flex justify-content-between align-items-start mb-3">
          <div class="flex-grow-1">
            <h5 class="role mb-1 fw-bold text-primary">${job.jobTitle}</h5>
            <div class="d-flex align-items-center gap-3">
              <p class="text-muted mb-0 small">${job.category || 'General'} • ${job.jobType || 'Full-time'}</p>
              <div class="d-flex align-items-center">
                <i class="bi bi-mortarboard-fill text-primary me-1"></i>
                <span class="small text-muted fw-medium">${job.qualification}</span>
              </div>
            </div>
          </div>
          <span class="badge ${
            job.status === "approved"
              ? "bg-success"
              : job.status === "pending"
              ? "bg-warning text-dark"
              : "bg-secondary"
          } text-capitalize px-3 py-2">${job.status}</span>
        </div>

        <div class="job-description mb-3">
          <p class="text-muted mb-2" style="line-height: 1.5;">${
            job.description.length > 150
              ? job.description.substring(0, 150) + "..."
              : job.description
          }</p>
        </div>

        <div class="job-meta mb-3">
          <div class="row g-2">
            <div class="col-6 col-md-3">
              <div class="info-card bg-light rounded p-2 text-center">
                <i class="bi bi-people-fill text-primary mb-1"></i>
                <div class="small fw-bold">${job.vacancy}</div>
                <div class="text-muted" style="font-size: 0.75rem;">Vacancies</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="info-card bg-light rounded p-2 text-center">
                <i class="bi bi-geo-alt-fill text-primary mb-1"></i>
                <div class="small fw-bold">${job.location}</div>
                <div class="text-muted" style="font-size: 0.75rem;">Location</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="info-card bg-light rounded p-2 text-center">
                <i class="bi bi-cash-stack text-primary mb-1"></i>
                <div class="small fw-bold">₹${job.salary || "Not specified"}</div>
                <div class="text-muted" style="font-size: 0.75rem;">Salary</div>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="info-card bg-light rounded p-2 text-center">
                <i class="bi bi-briefcase-fill text-primary mb-1"></i>
                <div class="small fw-bold">${job.experience}</div>
                <div class="text-muted" style="font-size: 0.75rem;">Experience</div>
              </div>
            </div>
          </div>
        </div>

       

        <div class="job-actions d-flex gap-2">
          ${
            job.status === "approved"
              ? `
            <div class="alert alert-warning w-100 p-2 m-0">
              Updating this job post is disabled as it is approved.<br>
              For any changes, please contact the admin.
            </div>
          `
              : `
            <button class="btn btn-sm btn-outline-primary edit-btn flex-fill">
              <i class="bi bi-pencil-square me-1"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger delete-btn flex-fill">
              <i class="bi bi-trash me-1"></i> Delete
            </button>
          `
          }
        </div>
      </div>
    `;

    // Attach event listeners only if buttons exist
    const editBtn = jobCard.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", function () {
        openEditModal(job);
      });
    }

    const deleteBtn = jobCard.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", async function () {
        const btn = this;
        btn.disabled = true;
        btn.textContent = "Deleting...";
        await showDeleteConfirmation(job.id);
        btn.disabled = false;
        btn.textContent = "Delete";
      });
    }

    jobListContainer.appendChild(jobCard);
  });
}


function openEditModal(job) {
  document.getElementById("editRequestId").value = job.id;
  document.getElementById("editTitle").value = job.jobTitle;
  document.getElementById("editDescription").value = job.description;
  document.getElementById("editVacancy").value = job.vacancy;
  document.getElementById("editLocation").value = job.location;
  document.getElementById("editQualification").value = job.qualification;
  document.getElementById("editExperience").value = job.experience;

  document.getElementById("editJobForm").style.display = "flex";
  document.body.style.overflow = "hidden";
}
document.getElementById("closeEditModalBtn").addEventListener("click", () => {
    document.getElementById("editJobForm").style.display = "none";
    document.body.style.overflow = "";
  });

document.getElementById("saveEditBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const updateBtn = e.target;
  updateBtn.disabled = true;
  updateBtn.textContent = "Saving...";

  const jobId = document.getElementById("editRequestId").value;

  const updatedData = {
    jobTitle: document.getElementById("editTitle").value.trim(),
    description: document.getElementById("editDescription").value.trim(),
    vacancy: parseInt(document.getElementById("editVacancy").value),
    qualification: document.getElementById("editQualification").value.trim(),
    experience: document.getElementById("editExperience").value.trim(),
    location: document.getElementById("editLocation").value.trim(),
  };

  console.log("Updated Job Data:", updatedData);

  try {
    await updateJob(jobId, updatedData);

    // Close modal after successful update
    document.getElementById("editJobForm").style.display = "none";
    document.body.style.overflow = "";
  } catch (error) {
    console.error("Error updating job:", error);
    alert("Failed to update job. Please try again.");
  }

  updateBtn.disabled = false;
  updateBtn.textContent = "Save Changes";
  document.getElementById("closeEditModalBtn").addEventListener("click", () => {
  document.getElementById("editJobForm").style.display = "none";
  document.body.style.overflow = "";
});

});


// ✅ Update job
async function updateJob(jobId, updatedData) {
  try {
    const email = recruiterEmail;
    console.log(jobId, email);
    const response = await fetch(
      `${API_URL}/api/recruiter/updateJob`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          updatedData,
        }),
      }
    );

    if (response.ok) {
      notyf.success("Job updated successfully!");
      fetchRequestedJobs();
    } else {
      notyf.error("Failed to update job.");
    }
  } catch (err) {
    notyf.error("Error updating job. Please try again.");
    console.error("Error updating job:", err);
  }
}
let jobIdToDelete = null;

window.showDeleteConfirmation = function(jobId) {
  jobIdToDelete = jobId;
  document.getElementById("customConfirmOverlay").style.display = "flex";
};

window.cancelDelete = function() {
  jobIdToDelete = null;
  document.getElementById("customConfirmOverlay").style.display = "none";
};

window.confirmDelete = async function() {
  if (!jobIdToDelete) return;

  try {
    const response = await fetch(`${API_URL}/api/recruiter/deleteJob`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: jobIdToDelete }),
    });

    if (response.ok) {
      notyf.success("Job deleted successfully!");
      fetchRequestedJobs();
    } else {
      notyf.error("Failed to delete job.");
    }
  } catch (err) {
    console.error("Error deleting job:", err);
    notyf.error("Error deleting job. Please try again.");
  } finally {
    jobIdToDelete = null;
    document.getElementById("customConfirmOverlay").style.display = "none";
  }
};


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
document.addEventListener("DOMContentLoaded", () => {
  const jobSearchInput = document.getElementById("categorySearchInput");

  jobSearchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();

    document.querySelectorAll(".job-card").forEach((card) => {
      const title = card.dataset.title || "";
      const desc = card.dataset.description || "";
      const vacancy = card.dataset.vacancy || "";
      const location = card.dataset.location || "";

      const match =
        title.includes(query) ||
        desc.includes(query) ||
        vacancy.includes(query) ||
        location.includes(query);

      card.style.display = !query || match ? "" : "none";
    });
  });
});

// ✅ Initial fetch

// fetchCurrentUser();
