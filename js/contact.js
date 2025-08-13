// contact.js
import { Notyf } from "https://cdn.skypack.dev/notyf";
 const notyf = new Notyf({
    duration: 2000, // ⏱ 5 seconds
    position: {
      x: "right", // 👉 left | center | right
      y: "top", // 👆 top | bottom
    },
  });
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
     const submitBtn = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Stop normal form submission
            submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        // Get form field values
        const fullName = document.getElementById("form-floating-1").value.trim();
        const email = document.getElementById("form-floating-2").value.trim();
        const subject = document.getElementById("form-floating-3").value.trim();
        const message = document.getElementById("form-floating-4").value.trim();

        // Create data object
        const formData = {
            name: fullName,
            email: email,
            subject: subject,
            message: message
        };

        try {
            const response = await fetch("https://srija-consultancy-backend-llao.onrender.com/api/contact", { // Change URL to your backend endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                notyf.success("Message sent successfully!");
                form.reset();
            } else {
                notyf.error("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            notyf.error("Something went wrong. Please try again later.");
        } finally {
            // Re-enable button & reset text
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }
    });
});
