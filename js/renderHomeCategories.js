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
  "Banking & Financial Services": "bi-cash-stack",                        // Banking
  "Beauty & Personal Care": "bi-brush-fill",                         // Beauty
  "Biotechnology": "bi-eyedropper", 
};



async function fetchCategories() {
  try {
    // https://srija-consultancy-backend.onrender.com
    // http://localhost:8080
   const res = await fetch("https://srija-consultancy-backend-llao.onrender.com/api/jobs/getCategory", {
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
// const ITEMS_PER_SLIDE = 5; // 5 cards per slide

function getItemsPerSlide() {
  const width = window.innerWidth;
  if (width >= 1200) return 5;
  if (width >= 992) return 4;
  if (width >= 768) return 3;
  if (width >= 576) return 2;
  return 1;
}

function renderCarouselSlides(categories) {
  const carouselInner = document.getElementById("carousel-inner");
  carouselInner.innerHTML = "";

  const itemsPerSlide = getItemsPerSlide();

  for (let i = 0; i < categories.length; i += itemsPerSlide) {
    const batch = categories.slice(i, i + itemsPerSlide);

    // Pad to maintain layout
    while (batch.length < itemsPerSlide) {
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

// Optional: Rerender on resize for responsive effect
window.addEventListener("resize", () => {
  if (window.lastRenderTimeout) clearTimeout(window.lastRenderTimeout);
  window.lastRenderTimeout = setTimeout(fetchCategories, 200); // debounce resize
});


function generateCard(category) {
  if (!category) {
    return `
      <div class="col">
        <div class="card invisible"></div>
      </div>
    `;
  }

  const icon = iconMap[category.name] || "bi-briefcase-fill";

  return `
    <div class="col d-flex justify-content-center">
      <a href="jobs.html?category=${encodeURIComponent(category.name)}" style="text-decoration: none; width: 100%;">
        <div class="card text-center h-100 border-0 shadow-sm"
             style="background-color: #ffffff; color: #258f76; border-radius: 12px; max-width: 240px;">
          <div class="card-body d-flex flex-column justify-content-center align-items-center p-3">
            <i class="bi ${icon}" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h6 class="card-title mb-1 text-truncate w-100" style="font-size: 1rem;">${category.name}</h6>
            <p class="mb-0" style="font-size: 0.85rem; color: #555;">${category.count} Vacancies</p>
          </div>
        </div>
      </a>
    </div>
  `;
}





fetchCategories();
