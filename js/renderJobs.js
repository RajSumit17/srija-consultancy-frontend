import { auth } from '../js/firebaseInit.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

function handleLogout() {
  setTimeout(()=>{
    console.log("handle logout")
  },5000)
  signOut(auth)
    .then(() => {
      // Clear session storage
      sessionStorage.clear();

      // Prevent back navigation
      history.pushState(null, null, location.href);
      window.addEventListener('popstate', () => {
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
fetchCurrentUser()
const jobListContainer = document.querySelector(".job-list");
const form = document.getElementById("addJobForm");

// Fetch and render all jobs
async function fetchAndRenderJobs() {
  const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/getAllJobs");
  const data = await res.json(); // data = { jobs: [...] }
  const jobs = data.jobs; // extract the array
  // Clear old jobs
  jobListContainer.innerHTML = `<h1>Current Job Postings</h1>`;

  jobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
  <div class="company-name">${job.companyName}</div>
  <div class="role">${job.role}</div>
  <div class="job-info">
      <div class="info-item">Salary: ${job.salary}</div>
      <div class="info-item">Job Type: ${job.jobType}</div>
      <div class="info-item">Location: ${job.location}</div>
      <div class="info-item">Experience: ${job.experience}</div>
      <div class="info-item">Vacancy: ${job.vacancy}</div>
  </div>
  <div>
      <div class="section-title">Description</div>
      <p class="job-description">${job.description}</p>
  </div>
  <div>
      <div class="section-title">Qualification</div>
      <p class="job-qualification">${job.qualification}</p>
  </div>
  <div>
      <div class="section-title">Responsibilities</div>
      <p class="job-qualification">${job.responsibility}</p>
  </div>
  <div class="d-flex justify-content-between mt-3">
    <button class="btn btn-danger btn-sm apply-btn delete-btn" data-id="${job.uniqueJobId}">🗑️ Delete</button>

  </div>
`;
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm(
        "Are you sure you want to delete this job? " + job.uniqueJobId
      );
      if (!confirmed) return;

      try {
        const res = await fetch(`https://srija-consultancy-backend.onrender.com/api/jobs/deleteJob`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uniqueJobId: job.uniqueJobId }),
        });

        if (res.ok) {
          alert("Job deleted successfully.");
          fetchAndRenderJobs(); // Refresh the list
        } else {
          const err = await res.json();
          alert("Failed to delete: " + err.message);
        }
      } catch (err) {
        alert("Error deleting job: " + err.message);
      }
    });

    jobListContainer.appendChild(card);

    // Now attach search event listeners after jobs are in the DOM
    setupJobSearch();
  });
}
function setupJobSearch() {
  const searchInput = document.getElementById("jobSearchInput");
  const searchForm = document.getElementById("jobSearchForm");

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll(".job-card").forEach((card) => {
      const title = card.querySelector(".role")?.innerText.toLowerCase() || "";
      const company =
        card.querySelector(".company-name")?.innerText.toLowerCase() || "";
      const location =
        Array.from(card.querySelectorAll(".info-item"))
          .find((i) => i.innerText.toLowerCase().includes("location:"))
          ?.innerText.toLowerCase() || "";
      const description =
        card.querySelector(".job-description")?.innerText.toLowerCase() || "";

      const match =
        title.includes(query) ||
        company.includes(query) ||
        location.includes(query) ||
        description.includes(query);

      card.style.display = !query || match ? "" : "none";
    });
  });

  searchInput.addEventListener("input", function () {
    if (!this.value.trim()) {
      document
        .querySelectorAll(".job-card")
        .forEach((card) => (card.style.display = ""));
    }
  });
}
// Submit handler for form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const jobData = {
    companyName: document.getElementById("jobCompany").value,
    role: document.getElementById("jobTitle").value,
    salary: document.getElementById("jobSalary").value,
    jobType: document.getElementById("jobType").value,
    location: document.getElementById("jobLocation").value,
    experience: document.getElementById("jobExperience").value,
    vacancy: document.getElementById("jobVacancy").value,
    description: document.getElementById("jobDescription").value,
    qualification: document.getElementById("jobQualification").value,
    responsibilities: document.getElementById("jobResponsibilities").value,
  };

  // Send job to backend
  const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/add-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });

  if (res.ok) {
    alert("Job posted successfully!");
    form.reset();
    await fetchAndRenderJobs(); // Refresh the job list
  } else {
    alert(res.data);
  }
});


// Initial load
fetchAndRenderJobs();
