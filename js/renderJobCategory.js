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
    const res = await fetch("http://localhost:8080/api/jobs/getCategory", {
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

  const row = document.createElement("div");
  row.className = "d-flex flex-wrap justify-content-center gap-3";

  categories.forEach((category) => {
    const iconClass = categoryIcons[category.name] || "bi-briefcase-fill";

    const cardCol = document.createElement("div");
    cardCol.className = "col-md-3 mb-4";
    // cardCol.setAttribute("data-category", category.name);

    // Allow card to shrink/grow naturally
    // cardCol.style.flex = "0 1 auto";
    // cardCol.style.marginBottom = "15px";

    cardCol.innerHTML = `
      
      <div class="category-card h-100" data-category="${category.name}">
        <i class="bi ${iconClass}" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <h5>${category.name}</h5>
        <p class="text-muted">Job Available: <strong>${category.count}</strong></p>
      </div>
    `;

    row.appendChild(cardCol);
  });

  categoryContainer.appendChild(row);
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
  window.location.href = `./category.html?category=${encodeURIComponent(category)}`;
});


// ✅ Call to fetch categories
fetchCategories();
