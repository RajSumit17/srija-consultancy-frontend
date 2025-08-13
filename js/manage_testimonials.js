import { Notyf } from "https://cdn.skypack.dev/notyf";
const notyf = new Notyf({
  duration: 2000,
  position: { x: "right", y: "top" },
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("testimonialsContainer");
  const localURL = "https://srija-consultancy-backend-llao.onrender.com";
  const API_URL = `${localURL}/api/apply/add-testimonials`;
  const DELETE_URL = `${localURL}/api/apply/delete-testimonial`;

  let deleteId = null; // store the id to delete

  async function loadTestimonials() {
    container.innerHTML = `<p class="text-muted text-center">Loading testimonials...</p>`;
    try {
      const res = await fetch(`${localURL}/api/apply/fetch-testimonials`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const testimonials = await res.json();

      if (!testimonials.length) {
        container.innerHTML = `<p class="text-center text-muted">No testimonials found.</p>`;
        return;
      }

      container.innerHTML = "";
      testimonials.forEach(t => {
        container.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card text-center p-3 h-100 shadow-sm position-relative">
              <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 delete-btn" data-id="${t.id}">
                <i class="bi bi-trash"></i>
              </button>
              <img src="${t.imageURL}" alt="${t.name}" class="rounded-circle mx-auto"
                style="width:100px; height:100px; object-fit:cover;">
              <blockquote class="mt-3 fst-italic">"${t.message}"</blockquote>
              <h5 class="mt-3">${t.name}</h5>
              <p class="text-muted">${t.designation}</p>
            </div>
          </div>
        `;
      });

      // Attach delete listeners
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          deleteId = btn.dataset.id; // store the testimonial id
          const modal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
          modal.show();
        });
      });

      notyf.success("Testimonials loaded successfully!");
    } catch (err) {
      console.error("Error loading testimonials:", err);
      notyf.error("Failed to load testimonials.");
      container.innerHTML = `<p class="text-danger text-center">Failed to load testimonials.</p>`;
    }
  }

  // Modal buttons
  document.getElementById("confirmDelete").addEventListener("click", async () => {
    if (!deleteId) return;
    try {
      const delRes = await fetch(`${DELETE_URL}/${deleteId}`, {
        method: "DELETE"
      });

      if (delRes.ok) {
        notyf.success("Testimonial deleted successfully!");
        loadTestimonials();
      } else {
        notyf.error("Failed to delete testimonial.");
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      notyf.error("Error deleting testimonial.");
    } finally {
      deleteId = null;
      bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal")).hide();
    }
  });

  document.getElementById("cancelDelete").addEventListener("click", () => {
    deleteId = null;
    bootstrap.Modal.getInstance(document.getElementById("deleteConfirmModal")).hide();
  });

  // Load testimonials initially
  loadTestimonials();


  // Handle form submission
  const form = document.getElementById("testimonialForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("addTestimonialModal")).hide();
        notyf.success("Testimonial added successfully!");
        loadTestimonials();
      } else {
        notyf.error("Failed to save testimonial.");
      }
    } catch (err) {
      console.error("Error saving testimonial:", err);
    }
  });
});
