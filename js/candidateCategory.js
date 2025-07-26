// category.js
const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const jobListContainer = document.querySelector(".job-list");
document.getElementById("categoryHeading").textContent = `${category} Jobs`;
import { Notyf } from "https://cdn.skypack.dev/notyf";
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
    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/getJobByCategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category }),
    }); // Local JSON file
    if (!res.ok) throw new Error("Failed to load jobs data.");
    const data = await res.json();
    console.log(data);
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
    showInterest(job.uniqueJobId); // Your handler
  });

  jobListContainer.appendChild(jobCard);
});

};

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


fetchJobs();
