async function fetchAndRenderRecruiters() {
  try {
    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/recruiter/fetchAllRecruiters");

    if (!res.ok) {
      throw new Error(`Failed to fetch recruiters: ${res.status}`);
    }

    const data = await res.json();
    const recruiters = data.recruiters;

    const container = document.getElementById("recruiterListContainer");
    container.innerHTML = ""; // Clear existing content

    recruiters.forEach((recruiter) => {
      const card = document.createElement("div");
      card.className = "job-card";

      card.innerHTML = `
        <div class="recruiter-card p-4 rounded shadow-sm border bg-white mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold text-primary mb-0">${recruiter.companyName}</h5>
          </div>

          <div class="recruiter-details mb-2">
            <p class="mb-1"><i class="fas fa-user text-muted me-2"></i> ${recruiter.contactPersonName}</p>
            <p class="mb-1"><i class="fas fa-envelope text-muted me-2"></i> ${recruiter.email}</p>
            <p class="mb-0"><i class="fas fa-phone text-muted me-2"></i> ${recruiter.jobsRequested?.number || 'N/A'}</p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching recruiters:", error.message);
    const container = document.getElementById("recruiterListContainer");
    container.innerHTML = `<p style="color: red;">Failed to load recruiters.</p>`;
  }
}

fetchAndRenderRecruiters();