import { Notyf } from "https://cdn.skypack.dev/notyf"; 

const notyf = new Notyf({
  duration: 2000, 
  position: { x: "right", y: "top" },
});

document.addEventListener("DOMContentLoaded", async () => {
  const companySelect = document.getElementById("companyName");
  const contactNameInput = document.getElementById("contactPersonName");
  const emailInput = document.getElementById("email");
  const numberInput = document.getElementById("number");
  const categorySelect = document.getElementById("category");

  // Modal elements
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const categoryModalEl = document.getElementById("categoryModal");
  const categoryModal = new bootstrap.Modal(categoryModalEl);
  const categoryForm = document.getElementById("categoryForm");
  const saveCategoryBtn = document.getElementById("saveCategoryBtn");
  const categoryNameInput = document.getElementById("categoryName");

  const localURL = "https://srija-consultancy-backend-llao.onrender.com";

  // -------------------- Companies --------------------
  async function loadCompanies() {
    try {
      const res = await fetch(`${localURL}/api/apply/getPartners`);
      if (!res.ok) throw new Error("Failed to fetch companies");
      const { data } = await res.json();
      companySelect.innerHTML = '<option value="">Select Company</option>';
      data.forEach(company => {
        const option = document.createElement("option");
        option.value = company.companyName;
        option.textContent = company.companyName;
        companySelect.appendChild(option);
      });
    } catch (error) {
      console.error(error);
      notyf.error("Failed to load companies");
    }
  }

  async function fetchCompanyDetails(companyName) {
    try {
      const res = await fetch(`${localURL}/api/apply/getCompanyById`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName })
      });
      if (!res.ok) throw new Error("Failed to fetch company details");
      const { data } = await res.json();
      contactNameInput.value = data.contactPersonName || "";
      emailInput.value = data.email || "";
      numberInput.value = data.number || "";
    } catch (error) {
      console.error(error);
      notyf.error("Failed to fetch company details");
    }
  }

  companySelect.addEventListener("change", async (e) => {
    const selectedCompany = e.target.value;
    if (selectedCompany) {
      await fetchCompanyDetails(selectedCompany);
    } else {
      contactNameInput.value = "";
      emailInput.value = "";
      numberInput.value = "";
    }
  });

  await loadCompanies();

  // -------------------- Categories --------------------
  async function loadCategories() {
    try {
      const res = await fetch(`${localURL}/api/jobs/getCategory`);
      const data = await res.json();
      const categories = data.categories || [];
      categorySelect.innerHTML = '<option value="">Select a category</option>';
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error(error);
      categorySelect.innerHTML = '<option value="">Failed to load categories</option>';
    }
  }

  await loadCategories();

  // -------------------- Add Category Modal --------------------
  addCategoryBtn.addEventListener("click", () => {
    categoryForm.reset();
    saveCategoryBtn.disabled = false;
    saveCategoryBtn.textContent = "Save";
    categoryModal.show();
  });

  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newCategory = categoryNameInput.value.trim();
    if (!newCategory) return;

    saveCategoryBtn.disabled = true;
    saveCategoryBtn.textContent = "Saving...";

    try {
      const res = await fetch(`${localURL}/api/apply/add-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryName: newCategory })
      });

      if (!res.ok) throw new Error("Failed to add category");
      const data = await res.json();

      if (data.success) {
        notyf.success("Category added successfully!");
        categoryModal.hide();
        await loadCategories(); // refresh dropdown
        categorySelect.value = newCategory; // auto-select the new category
      } else {
        throw new Error(data.message || "Failed to add category");
      }
    } catch (error) {
      console.error(error);
      notyf.error(error.message || "Failed to add category");
    } finally {
      saveCategoryBtn.disabled = false;
      saveCategoryBtn.textContent = "Save";
    }
  });

  // -------------------- Job Form Submission --------------------
  document.getElementById("jobForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById("save");
    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;

    const formData = {
      jobTitle: document.querySelector("[name='jobTitle']").value.trim(),
      category: document.querySelector("[name='category']").value.trim(),
      description: document.querySelector("[name='description']").value.trim(),
      experience: document.querySelector("[name='experience']").value.trim(),
      jobType: document.querySelector("[name='jobType']").value.trim(),
      location: document.querySelector("[name='location']").value.trim(),
      qualification: document.querySelector("[name='qualification']").value.trim(),
      salary: document.querySelector("[name='salary']").value.trim(),
      vacancy: parseInt(document.querySelector("[name='vacancy']").value, 10),
      companyName: document.querySelector("[name='companyName']").value,
      contactPersonName: document.querySelector("[name='contactPersonName']").value.trim(),
      email: document.querySelector("[name='email']").value.trim(),
      number: document.querySelector("[name='number']").value.trim(),
      status: document.querySelector("[name='status']").value.trim(),
      requestedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${localURL}/api/jobs/postJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to post job");
      const data = await res.json();
      notyf.success("Job posted successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      notyf.error("Error posting job. Please try again.");
    } finally {
      saveBtn.textContent = "Save";
      saveBtn.disabled = false;
    }
  });
});
