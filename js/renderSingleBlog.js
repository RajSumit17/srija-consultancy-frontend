// renderSingleBlog.js

const blogContainer = document.getElementById("single-blog-wrapper");

// Replace this with your actual API endpoint
const BLOG_API_URL = "https://srija-consultancy-backend.onrender.com/api/apply/fetch-blogs"; // returns an array of blogs

async function fetchAndRenderSingleBlog() {
  try {
    const response = await fetch(BLOG_API_URL);
    const blogs = await response.json();

    if (blogs.length === 0) {
      blogContainer.innerHTML = "<p>No blogs found.</p>";
      return;
    }

    const blog = blogs[0]; // only the first blog
const blogCard = `
  <div class="card shadow w-100 p-3" style="border-radius: 12px; overflow: hidden;">
    <div class="row g-0" style="min-height: 300px;">
      
      <!-- Left: Image -->
      <div class="col-md-5">
        <img src="../img/blog-1.jpg" class="img-fluid rounded-start" alt="${blog.title}" style="height: 100%; width: 100%; object-fit: cover;">
      </div>

      <!-- Right: Content -->
      <div class="col-md-7 position-relative">
        <!-- Centered Title + Description -->
        <div class="h-100 d-flex flex-column justify-content-center align-items-center text-center px-3">
          <h5 class="card-title mb-3">${blog.title}</h5>
          <p class="card-text" style="color: #555;">${truncateText(blog.description, 200)}</p>
        </div>

        <!-- Author & Time at bottom right -->
        <div style="position: absolute; bottom: 15px; right: 20px; text-align: right; font-size: 0.85rem; color: #888;">
          <div><i class="bi bi-person-circle"></i> ${blog.author}</div>
          <div class="mt-1"><i class="bi bi-calendar-event"></i> ${formatDate(blog.createdAt)}</div>
        </div>
      </div>

    </div>
  </div>
`;


    blogContainer.innerHTML = blogCard;
  } catch (error) {
    console.error("Error fetching blog:", error);
    blogContainer.innerHTML = "<p>Error loading blog.</p>";
  }
}
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function truncateText(text, limit) {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
}

// Call the function when script loads
fetchAndRenderSingleBlog();
