// category.js
const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const jobListContainer = document.querySelector(".job-list");
document.querySelector("h1").textContent = `${category}`;

const fetchJobs = async () => {
  try {
    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/getJobByCategory",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: category }),
      }); // Local JSON file
    if (!res.ok) throw new Error("Failed to load jobs data.");
    const data = await res.json();
    console.log(data)
    const jobs = data[category] || [];
    renderJobs(data);
  } catch (error) {
    console.error("Error fetching job data:", error);
    jobListContainer.innerHTML = `<p>Failed to load jobs.</p>`;
  }
};

const renderJobs = (jobs) => {
  if (jobs.length === 0) {
    jobListContainer.innerHTML += `<p>No jobs found in this category.</p>`;
    return;
  }

  jobs.forEach(job => {
    const jobCard = document.createElement("div");
    jobCard.className = "job-card mb-3 p-3 border rounded";
    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <p><em>${job.company}</em></p>
      <p><strong>Location:</strong> ${job.location} | <strong>Experience:</strong> ${job.experience}</p>
      <p><strong>Salary:</strong> ${job.salary} | <strong>Type:</strong> ${job.jobType}</p>
      <p><strong>Vacancy:</strong> ${job.vacancy}</p>
      <p><strong>Qualification:</strong> ${job.qualification}</p>
      <p><strong>Responsibilities:</strong> ${job.responsibility}</p>
      <button class="btn btn-outline-primary interested-btn">Interested</button>
    `;
    jobListContainer.appendChild(jobCard);
  });

  // Add event listeners to all "Interested" buttons
  const buttons = document.querySelectorAll('.interested-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = '../registration_layouts/Login.html'; // Adjust path if needed
    });
  });
};


fetchJobs();
