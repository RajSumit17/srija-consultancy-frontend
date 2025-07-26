const blogListContainer = document.getElementById("blog-list");
const imageURL = "../img/blog-1.jpg";
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
    const response = await fetch("https://srija-consultancy-backend.onrender.com/api/apply/fetch-blogs");

    if (!response.ok) throw new Error("Failed to fetch blogs");

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

      // Blog card wrapper
      const row = document.createElement("div");
      row.className = "row mb-5 align-items-center justify-content-center";

      // Card wrapper without border
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "card p-3 position-relative"; // removed shadow-sm
      cardWrapper.style.border = "none"; // remove border completely
      cardWrapper.style.borderRadius = "10px";

      // Content row inside card
      const contentRow = document.createElement("div");
      contentRow.className = "row align-items-center";

      // Image column
      const imageCol = document.createElement("div");
      imageCol.className = "col-md-6 px-0";
      imageCol.innerHTML = `
    <div class="img_container d-flex justify-content-center">
      <div class="img-box" style="width: 80%; max-width: 500px;">
        <img src="${imageURL}" alt="Blog Image" style="width: 100%; height: auto; border-radius: 8px;">
      </div>
    </div>`;

      // Text column with centered title
      const textCol = document.createElement("div");
      textCol.className = "col-md-6 px-4 d-flex align-items-center";
      textCol.innerHTML = `
    <div class="detail-box text-center w-100"> <!-- centered title -->
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
      cardWrapper.appendChild(contentRow);
      row.appendChild(cardWrapper);
      blogListContainer.appendChild(row);
    });
  } catch (error) {
    console.error("Failed to load blogs:", error);
    blogListContainer.innerHTML =
      '<p class="text-danger">Failed to load blogs.</p>';
  }
};

// addBlogHandler.js

document.addEventListener("DOMContentLoaded", () => {
  const blogForm = document.getElementById("blogForm");

  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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
      const res = await fetch("https://srija-consultancy-backend.onrender.com/api/apply/add-blogs", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Blog added successfully!");
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
    }
  });
});

renderBlogs();
