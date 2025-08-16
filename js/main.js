(function ($) {
    "use strict";

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 40) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    });
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });
    
})(jQuery);

import { auth } from '../js/firebaseInit.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

function handleLogout() {
    console.log("handle Logout")
  signOut(auth)
    .then(() => {
      // Clear session storage
      sessionStorage.clear();

      // Prevent back navigation
      history.pushState(null, null, location.href);
      window.addEventListener('popstate', () => {
        history.pushState(null, null, location.href);
      });

      // Redirect to login/home page
       window.location.replace("/index.html");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

window.handleLogout = handleLogout; // So it's available globally for the HTML `onclick`
const fetchCurrentUser = () => {
  // Wait for DOM to be ready before checking authentication
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      checkAuthentication();
    });
  } else {
    checkAuthentication();
  }
};

const checkAuthentication = () => {
  // Get current page path to check if authentication is required
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop(); // Get just the filename
  
  console.log("Current path:", currentPath);
  console.log("Current page:", currentPage);
  
  const publicPages = [
    'index.html',
    'contact.html', 
    'about.html',
    'jobs.html',
    'blog.html',
    'feature.html',
    'testimonial.html'
  ];
  
  // Check if current page is a public page - more flexible matching
  const isPublicPage = publicPages.includes(currentPage) || 
                      currentPath === '/' || 
                      currentPath === '/index.html' ||
                      currentPath.includes('contact.html') ||
                      currentPath.includes('about.html') ||
                      currentPath.includes('jobs.html') ||
                      currentPath.includes('blog.html') ||
                      currentPath.includes('feature.html') ||
                      currentPath.includes('testimonial.html') ||
                      currentPage === '' || // Handle root path
                      currentPage === null; // Handle edge cases
  
  console.log("Is public page:", isPublicPage);
  
  // For production, be more lenient with authentication checks
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    console.log("Running in production mode");
    // In production, only check authentication for clearly protected pages
    const protectedPages = [
      'admin_',
      'candidate_',
      'recruiter_'
    ];
    
    const isProtectedPage = protectedPages.some(prefix => 
      currentPath.includes(prefix) || currentPage?.startsWith(prefix)
    );
    
    if (!isProtectedPage) {
      console.log("Public page in production - allowing access");
      return; // Don't run authentication check for public pages in production
    }
  }
  
  // Add a small delay to ensure Firebase auth is initialized
  setTimeout(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is signed in:", user.email);
        } else {
          console.log("No user is signed in");
          // Only redirect if this is not a public page
          if (!isPublicPage) {
            console.log("Redirecting to index.html - page requires authentication");
            // Use absolute path to avoid relative path issues
            window.location.replace("/index.html");
          } else {
            console.log("Allowing access to public page");
          }
        }
      }, (error) => {
        console.error("Firebase auth error:", error);
        // If there's a Firebase error, allow access to public pages
        if (isPublicPage) {
          console.log("Firebase error but allowing access to public page");
        }
      });
    } catch (error) {
      console.error("Error in authentication check:", error);
      // If there's any error, allow access to public pages
      if (isPublicPage) {
        console.log("Error occurred but allowing access to public page");
      }
    }
  }, 500); // 500ms delay to ensure Firebase is ready
};
fetchCurrentUser()