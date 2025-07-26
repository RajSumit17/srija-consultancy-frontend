// File: js/renderCategories.js

const iconMap = {
  "3D Printing & Drones/Robotics": "bi-cpu-fill",                     // Technology/Automation
  "AR/VR & Blockchain": "bi-vr",                                     // AR/VR
  "Account & Finance": "bi-calculator-fill",                               // Finance
  "Admin Jobs": "bi-person-lines-fill",                              // Admin
  "Agriculture & Forestry": "bi-tree-fill",                          // Nature/Agri
  "Animation & VFX": "bi-camera-video-fill",                         // Animation
  "Architecture": "bi-building",                                     // Building
  "Architecture & Interior Design": "bi-house-door-fill",            // Home/Interior
  "Automobile Sector": "bi-gear-fill",                        // Vehicle
  "Banking & Financial Services": "bi-cash-stack",                         // Banking
  "Beauty & Personal Care": "bi-brush-fill",                         // Beauty
  "Biotechnology": "bi-eyedropper", 
};



async function fetchCategories() {
  try {
   const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/getCategory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    console.log("Fetched categories:", data.categories);
    renderCarouselSlides(data.categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}
const ITEMS_PER_SLIDE = 5; // 5 cards per slide

function renderCarouselSlides(categories) {
  const carouselInner = document.getElementById("carousel-inner");
  carouselInner.innerHTML = "";

  for (let i = 0; i < categories.length; i += ITEMS_PER_SLIDE) {
    const batch = categories.slice(i, i + ITEMS_PER_SLIDE);

    // Pad to maintain layout
    while (batch.length < ITEMS_PER_SLIDE) {
      batch.push(null);
    }

    const isActive = i === 0 ? "active" : "";

    const slide = document.createElement("div");
    slide.className = `carousel-item ${isActive}`;
    slide.innerHTML = `
      <div class="container py-4">
        <div class="row justify-content-center g-3">
          ${batch.map(generateCard).join("")}
        </div>
      </div>
    `;
    carouselInner.appendChild(slide);
  }
}

function generateCard(category) {
  if (!category) {
    // Placeholder for empty slot
    return `
      <div class="col" style="flex: 1 1 20%; max-width: 20%; visibility: hidden;">
        <div class="card" style="height: 100%;"></div>
      </div>
    `;
  }

  const icon = iconMap[category.name] || "bi-briefcase-fill";

  return `
    <div class="col" style="flex: 1 1 20%; max-width: 20%;">
      <a href="jobs.html?category=${encodeURIComponent(category.name)}" style="text-decoration: none;">
        <div class="card text-center h-100"
          style="background-color: #ffffff; color: #258f76; padding: 20px; border-radius: 15px; box-shadow: none; height: 100%;">
          <div class="card-body d-flex flex-column justify-content-center">
            <i class="bi ${icon}" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h6 class="card-title">${category.name}</h6>
            <p style="margin: 0; font-size: 0.85rem; color: #555;">${category.count} Vacancies</p>
          </div>
        </div>
      </a>
    </div>
  `;
}



fetchCategories();
