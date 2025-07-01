// renderCategories.js

const categoryContainer = document.getElementById("categoryContainer");
const categorySearchInput = document.getElementById("categorySearchInput");

let categoryData = []; // stores category: jobs[]

const loader = document.getElementById("loader");

const fetchCategories = async () => {
  try {
    loader.style.display = "block"; // Show loader
    categoryContainer.innerHTML = ""; // Clear previous content

    const res = await fetch("http://localhost:8080/api/jobs/getCategory", {
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

const renderCategories = (categories) => {
  categoryContainer.innerHTML = "";
  categories.forEach((category) => {
    const card = document.createElement("div");
    card.className = "col-md-3 mb-4";
    card.innerHTML = `
      <div class="category-card h-100" data-category="${category.name}">
        <img src="../Data/image.png" alt="${category.name}" />
        <h5>${category.name}</h5>
        <p class="text-muted">Job Available: <strong>${category.count}</strong></p>
      </div>
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
