const categoryContainer = document.getElementById("categoryContainer");
const categorySearchInput = document.getElementById("categorySearchInput");
const loader = document.getElementById("loader");

let categoryData = []; // Stores all categories fetched from backend

// ✅ Embedded icon mapping
const categoryIcons = {
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
  "Biotechnology": "bi-eyedropper",                                  // Lab/Bio
};

const fetchCategories = async () => {
  try {
    loader.style.display = "block"; // Show loader
    categoryContainer.innerHTML = ""; // Clear previous content
    // http://localhost:8080
    // https://srija-consultancy-backend.onrender.com
    const res = await fetch("https://srija-consultancy-backend.onrender.com/api/jobs/getCategory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch category data");

    const data = await res.json();
    categoryData = data.categories;
    renderCategories(categoryData); // Render using icons
  } catch (err) {
    console.error("Error loading categories:", err);
    categoryContainer.innerHTML = `<p class="text-danger text-center">Failed to load categories.</p>`;
  } finally {
    loader.style.display = "none"; // Hide loader
  }
};

const renderCategories = (categories) => {
  categoryContainer.innerHTML = "";

  // Add a container row with centered content
  const row = document.createElement("div");
  row.className = "row justify-content-center gap-3"; // Bootstrap centering and spacing
  row.style.flexWrap = "wrap";

  categories.forEach((category) => {
    const iconClass = categoryIcons[category.name] || "bi-briefcase-fill";
    console.log(categoryIcons[category.name], category.name);

    const cardCol = document.createElement("div");
    cardCol.className = "col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center"; // Responsive
    cardCol.style.maxWidth = "21%"; // match your style
    cardCol.style.flex = "1 1 21%";
    cardCol.style.marginBottom = "20px";

    cardCol.innerHTML = `
      <a href="jobs.html" style="text-decoration: none; width: 100%;">
        <div class="card text-center category-card" style="background-color: #ffffff; color: #258f76; padding: 20px; border-radius: 15px; box-shadow: none;" data-category="${category.name}">
          <div class="card-body">
            <i class="bi ${iconClass}" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h6 class="card-title">${category.name}</h6>
            <p class="text-muted">Job Available: <strong>${category.count}</strong></p>
          </div>
        </div>
      </a>
    `;

    row.appendChild(cardCol);
  });

  categoryContainer.appendChild(row); // Inject the complete row
};

// Search filter
categorySearchInput.addEventListener("input", () => {
  const query = categorySearchInput.value.toLowerCase();
  const filtered = categoryData.filter((category) =>
    category.name.toLowerCase().includes(query)
  );
  renderCategories(filtered, categoryIcons); // Pass icons map again
});

// Handle category click
categoryContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".category-card");
  if (!card) return;
  const category = card.dataset.category;
  sessionStorage.setItem("selectedCategory", category);
  const path = "./category.html";
  window.location.href = `${path}?category=${encodeURIComponent(category)}`;
});

// ✅ Call to fetch categories
fetchCategories();
