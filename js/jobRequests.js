const jobRequestContainer = document.getElementById("jobRequestContainer");

let selectedRequestId = null;
let selectedButton = null;

// Dummy data
const jobRequests = [
  {
    description: "Lorem fbeiej jobfrbrir",
    experience: "2+ yrs",
    jobTitle: "IoT Developer",
    location: "Delhi, Bangalore",
    qualification: "B.E/B.Tech",
    vacancy: "2",
    status: "pending",
    requestedAt: "19 July 2025",
    recruiter: {
      companyName: "Accenture",
      contactPersonName: "Aman",
      email: "rekhafamily578@gmail.com",
      number: "9986252100",
    },
    requestId: "54b7bcaa-530f-4856-bccc-cc56bd227ee1",
  },
  {
    description: "Lorem fbeiej jobfrbrir",
    experience: "2+ yrs",
    jobTitle: "IoT Developer",
    location: "Delhi, Bangalore",
    qualification: "B.E/B.Tech",
    vacancy: "2",
    status: "pending",
    requestedAt: "19 July 2025",
    recruiter: {
      companyName: "Accenture",
      contactPersonName: "Aman",
      email: "rekhafamily578@gmail.com",
      number: "9986252100",
    },
    requestId: "54b7bcaa-530f-4856-bccc-cc56bd227ee1",
  },
];

const renderJobRequests = (requests) => {
  jobRequestContainer.innerHTML = "";
  if (requests.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "text-center text-muted my-5";
    emptyMessage.innerHTML = `
      <i class="bi bi-inbox display-4 d-block mb-3"></i>
      <h5>No job requests found</h5>
      <p>You're all caught up!</p>
    `;
    jobRequestContainer.appendChild(emptyMessage);
    return;
  }
  requests.forEach((job) => {
    const card = document.createElement("div");
    card.className = "card shadow-sm mb-4";

    // Format requestedAt if it's a Firestore timestamp object
    let formattedDate = "Unknown Date";
    if (job.requestedAt?.seconds) {
      const requestedDate = new Date(job.requestedAt.seconds * 1000);
      formattedDate = requestedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    card.innerHTML = `
  <div class="card-body p-4">
    <!-- Job Header -->
    <div class="d-flex justify-content-between align-items-start flex-wrap mb-3">
      <div>
        <h4 class="fw-bold text-primary mb-2">${job.jobTitle}</h4>
        <div class="text-muted small">
          <span class="me-3"><i class="bi bi-tags me-1"></i> ${job.category || "N/A"}</span>
          <span class="me-3"><i class="bi bi-geo-alt me-1"></i> ${job.location}</span>
          <span><i class="bi bi-people me-1"></i> ${job.vacancy} Vacancy</span>
        </div>
      </div>
      <div class="text-end">
        <span class="badge ${
          job.status.toLowerCase() === "approved"
            ? "bg-success"
            : "bg-warning text-dark"
        } px-3 py-2 mb-2">${job.status.toUpperCase()}</span><br>
        <small class="text-muted"><i class="bi bi-clock me-1"></i> Requested: ${formattedDate}</small>
      </div>
    </div>

    <!-- Job Details -->
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <div class="p-3 bg-light rounded h-100">
          <p class="mb-2"><i class="bi bi-person-lines-fill text-primary me-2"></i><strong>Experience:</strong> ${job.experience}</p>
          <p class="mb-2"><i class="bi bi-briefcase-fill text-primary me-2"></i><strong>Qualification:</strong> ${job.qualification}</p>
          <p class="mb-0"><i class="bi bi-cash-stack text-primary me-2"></i><strong>Salary:</strong> ₹${job.salary || "Not Specified"}</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-3 bg-light rounded h-100">
          <p class="mb-2"><i class="bi bi-card-text text-primary me-2"></i><strong>Description:</strong></p>
          <p class="small text-muted mb-0">${job.description.length > 180 ? job.description.substring(0, 180) + "..." : job.description}</p>
        </div>
      </div>
    </div>

    <!-- Recruiter Details -->
    <div class="mt-3">
      <h6 class="fw-bold text-dark mb-3"><i class="bi bi-building me-2 text-primary"></i>Recruiter Details</h6>
      <div class="row g-3">
        <div class="col-md-6">
          <p class="mb-1"><strong>Company:</strong> ${job.recruiter.companyName}</p>
          <p class="mb-1"><strong>Contact Person:</strong> ${job.recruiter.contactPersonName}</p>
        </div>
        <div class="col-md-6">
          <p class="mb-1"><strong>Email:</strong> <a href="mailto:${job.recruiter.email}" class="text-decoration-none">${job.recruiter.email}</a></p>
          <p class="mb-1"><strong>Phone:</strong> <a href="tel:${job.recruiter.number}" class="text-decoration-none">${job.recruiter.number}</a></p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-4 d-flex justify-content-end">
      <button class="btn btn-success px-4 shadow-sm" onclick="openConfirmModal('${job.requestId}', this)">
        <i class="bi bi-check-circle me-1"></i> Approve Job
      </button>
    </div>
  </div>
`;


    jobRequestContainer.appendChild(card);
  });
};

const openConfirmModal = (requestId, button) => {
  selectedRequestId = requestId;
  selectedButton = button;
  const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
  modal.show();
};

const approveJob = async () => {
  if (!selectedRequestId || !selectedButton) return;

  const button = selectedButton;
  const requestId = selectedRequestId;

  button.disabled = true;
  button.innerText = "Processing...";

  try {
    const response = await fetch("https://srija-consultancy-backend-llao.onrender.com/api/jobs/addJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId }),
    });

    if (response.ok) {
      button.classList.remove("btn-outline-success");
      button.classList.add("btn-secondary");
      button.innerText = "Approved";
    } else {
      throw new Error("Approval failed");
    }
  } catch (error) {
    console.error("Approval Error:", error.message);
    button.disabled = false;
    button.innerText = "Approve Job";
  }

  // Close modal and reset
  const modalEl = document.getElementById("confirmModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance.hide();

  selectedRequestId = null;
  selectedButton = null;
  fetchJobRequested();
};

// Attach modal confirm button event
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("modalConfirmBtn")
    .addEventListener("click", approveJob);
  fetchJobRequested();
});

const fetchJobRequested = async () => {
  try {
    const resp = await fetch(
      "https://srija-consultancy-backend-llao.onrender.com/api/apply/getJobsRequested"
    );
    const data = await resp.json();
    console.log(data);
    renderJobRequests(data);
  } catch (error) {
    console.error("Failed to fetch job requests", error);
  }
};
