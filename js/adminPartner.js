import { API_URL,LOCAL_API_URL } from "./URL.js";

async function fetchAndRenderRecruiters() {
  try {
    const res = await fetch(`${API_URL}/api/recruiter/fetchAllRecruiters`);

    if (!res.ok) {
      throw new Error(`Failed to fetch recruiters: ${res.status}`);
    }

    const data = await res.json();
    const recruiters = data.recruiters;

    const container = document.getElementById("recruiterListContainer");
container.innerHTML = ""; // Clear existing content

// Create a row to hold the cards
const row = document.createElement("div");
row.className = "row";

recruiters.forEach((recruiter) => {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 mb-4"; // Responsive: 2 per row (md), 3 per row (lg)

  col.innerHTML = `
    <div class="recruiter-card p-4 rounded shadow-sm border bg-white h-100">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-primary mb-0">${recruiter.companyName}</h5>
      </div>

      <div class="recruiter-details mb-2">
        <p class="mb-1"><i class="fas fa-user text-muted me-2"></i> ${recruiter.contactPersonName}</p>
        <p class="mb-1"><i class="fas fa-envelope text-muted me-2"></i> ${recruiter.email}</p>
        <p class="mb-0"><i class="fas fa-phone text-muted me-2"></i> ${recruiter.number || 'N/A'}</p>
      </div>
    </div>
  `;

  row.appendChild(col);
});

container.appendChild(row);

  } catch (error) {
    console.error("Error fetching recruiters:", error.message);
    const container = document.getElementById("recruiterListContainer");
    container.innerHTML = `<p style="color: red;">Failed to load recruiters.</p>`;
  }
}

fetchAndRenderRecruiters();