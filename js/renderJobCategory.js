// renderCategories.js

const categoryContainer = document.getElementById("categoryContainer");
const categorySearchInput = document.getElementById("categorySearchInput");

let categoryData = []; // stores category: jobs[]

const loader = document.getElementById("loader");

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
    console.log(data.categories);
    renderCategories(data.categories); // Pass the array directly
  } catch (err) {
    console.error("Error loading categories:", err);
    categoryContainer.innerHTML = `<p class="text-danger text-center">Failed to load categories.</p>`;
  } finally {
    loader.style.display = "none"; // Hide loader
  }
};

import categoryIcons from './categoryIcons.json' assert { type: 'json' };

const renderCategories = (categories) => {
  categoryContainer.innerHTML = "";
  categories.forEach((category) => {
    const iconClass = categoryIcons[category.name] || "bi-briefcase-fill"; // fallback icon

    const card = document.createElement("div");
    card.className = "col";
    card.style.flex = "1 1 21%";
    card.style.maxWidth = "21%";

    card.innerHTML = `
      <a href="jobs.html" style="text-decoration: none;">
        <div class="card text-center" style="background-color: #ffffff; color: #258f76; padding: 20px; border-radius: 15px; box-shadow: none;" data-category="${category.name}">
          <div class="card-body">
            <i class="bi ${iconClass}" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h6 class="card-title">${category.name}</h6>
            <p class="text-muted">Job Available: <strong>${category.count}</strong></p>
          </div>
        </div>
      </a>
    `;
    categoryContainer.appendChild(card);
  });
};


// Search filter
categorySearchInput.addEventListener("input", () => {
  const query = categorySearchInput.value.toLowerCase();

  const filtered = categoryData.filter((category) =>
    category.name.toLowerCase().includes(query)
  );

  renderCategories(filtered);
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

fetchCategories();
