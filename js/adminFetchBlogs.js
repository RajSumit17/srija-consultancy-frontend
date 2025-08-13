import { Notyf } from "https://cdn.skypack.dev/notyf";
import { API_URL,LOCAL_API_URL } from "./URL.js";
const blogListContainer = document.getElementById("blog-list");
const imageURL = "../img/blog-1.jpg"
const randomImage =
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D";
// Converts Google Drive or other image links into proper embeddable format
const sanitizeImageURL = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com")) {
    const match = url.match(/[-\w]{25,}/);
    const fileId = match ? match[0] : "";
    return `https://drive.googleusercontent.com/uc?export=view&id=${fileId}`;
  }
  return url;
};
const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });
// Format blog created date nicely
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Invalid Date";
  }
};

const renderBlogs = async () => {
  try {
    const response = await fetch(`${API_URL}/api/apply/fetch-blogs`);

    if (!response.ok) {
      notyf.error("Failed to fetch blogs");
      throw new Error("Failed to fetch blogs");
    }

    const blogs = await response.json();
    console.log("Fetched blogs:", blogs);

    if (!Array.isArray(blogs) || blogs.length === 0) {
      blogListContainer.innerHTML =
        '<p class="text-muted">No blogs available.</p>';
      return;
    }

    blogListContainer.innerHTML = ""; // Clear previous content

    blogs.forEach((blog, index) => {
      const isEven = index % 2 === 0;
    //   const imageURL = sanitizeImageURL(blog.imageURL);

      // Blog card wrapper
      const row = document.createElement("div");
      row.className = "row mb-5 align-items-center justify-content-center";

      // Card wrapper with position-relative
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "card shadow-sm p-3 position-relative";
      cardWrapper.style.borderRadius = "10px";

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className =
        "btn btn-md text-danger position-absolute top-0 end-0 m-2";
      deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      deleteBtn.title = "Delete Blog";
      deleteBtn.onclick = () => deleteBlog(blog.id, row); // remove row on success

      // Content row inside card
      const contentRow = document.createElement("div");
      contentRow.className = "row align-items-center";

      // Image column
      const imageCol = document.createElement("div");
      imageCol.className = "col-md-6 px-0";
      imageCol.innerHTML = `
    <div class="img_container d-flex justify-content-center">
      <div class="img-box" style="width: 80%; max-width: 500px;">
        <img src="${blog.imageURL}" alt="Blog Image" style="width: 100%; height: auto; border-radius: 8px;">
      </div>
    </div>`;

      // Text column
      const textCol = document.createElement("div");
      textCol.className = "col-md-6 px-4 d-flex align-items-center";
      textCol.innerHTML = `
    <div class="detail-box">
      <h3 class="fw-bold text-primary">${blog.title}</h3>
      <p class="text-muted"><b>${blog.description}</b></p>
      <small>By ${blog.author || "Admin"} | ${formatDate(
        blog.createdAt
      )}</small>
    </div>`;

      // Append in alternating order
      contentRow.appendChild(isEven ? imageCol : textCol);
      contentRow.appendChild(isEven ? textCol : imageCol);

      // Append elements to card
      cardWrapper.appendChild(deleteBtn);
      cardWrapper.appendChild(contentRow);
      row.appendChild(cardWrapper);
      blogListContainer.appendChild(row);

    });
  } catch (error) {
    notyf.error("Failed to load blogs");
    console.error("Failed to load blogs:", error);
    blogListContainer.innerHTML =
      '<p class="text-danger">Failed to load blogs.</p>';
  }
};

// addBlogHandler.js

document.addEventListener("DOMContentLoaded", () => {
  const blogForm = document.getElementById("blogForm");
  const submitBtn = document.getElementById("submitBlogBtn");
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true; // Disable button to prevent multiple submissions
    submitBtn.innerHTML = "Submitting..."; // Change button text

    const title = document.getElementById("blogTitle").value.trim();
    const description = document.getElementById("blogDescription").value.trim();
    const author = document.getElementById("blogAuthor").value.trim();
    const imageFile = document.getElementById("blogImage").files[0];

    if (!imageFile) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("file", imageFile);

    try {
      const res = await fetch(`${API_URL}/api/apply/add-blogs`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // alert("Blog added successfully!");
        notyf.success("Blog added successfully!");
        renderBlogs();
        blogForm.reset();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addBlogModal")
        );
        modal.hide();
        // Optional: Reload or re-fetch blog list
      } else {
        throw new Error(data.message || "Failed to add blog");
      }
    } catch (err) {
      console.error("Error adding blog:", err.message);
      alert("Error adding blog.");
    }finally{
       submitBtn.disabled = true; // Disable button to prevent multiple submissions
    submitBtn.innerHTML = "Submitting..."; // Change button text

    }
  });
});
const deleteBlog = (blogId, rowElement) => {
  const modalElement = document.getElementById("deleteModal");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");

  // Initialize Bootstrap modal
  const bootstrapModal = new bootstrap.Modal(modalElement);

  // Clean up old listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  // Confirm delete handler
  newConfirmBtn.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/api/apply/delete-blog`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: blogId }),
      });

      if (!response.ok) {
        notyf.error("Failed to delete blog");
        throw new Error("Failed to delete blog");
      }

      notyf.success("Blog deleted successfully!");
      rowElement.remove();
      renderBlogs();
    } catch (error) {
      notyf.error("Error deleting blog");
      console.error("Error deleting blog:", error);
    } finally {
      bootstrapModal.hide(); // Close the modal
    }
  });

  // Show the modal
  bootstrapModal.show();
};


renderBlogs();
