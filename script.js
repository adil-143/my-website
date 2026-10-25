document.addEventListener("DOMContentLoaded", function () {

    // ABOUT SECTION TABS
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {

            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove("active");
            });

            // Activate clicked button
            button.classList.add("active");

            // Show selected content
            const tabId = button.dataset.tab;

            const selectedContent = document.getElementById(tabId);

            if (selectedContent) {
                selectedContent.classList.add("active");
            }
        });
    });

    // COPYRIGHT YEAR

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // CONTACT FORM

    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    // Check whether form exists
    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const submitButton = contactForm.querySelector(
                'button[type="submit"]'
            );

            // Check whether submit button exists
            if (!submitButton) {
                console.error("Submit button not found!");
                return;
            }

            // Disable button during submission
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            // Clear previous message
            if (formStatus) {
                formStatus.textContent = "";
            }

            try {
                // Send form to Formspree
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        Accept: "application/json"
                    }
                });

                // Successful submission
                if (response.ok) {
                    // Clear form fields
                    contactForm.reset();

                    // Display success message
                    if (formStatus) {
                        formStatus.textContent =
                            "Message sent successfully! Thank you.";
                        formStatus.style.color = "#00bfff";
                    }

                } else {
                    // Form submission failed
                    const result = await response.json();
                    console.error("Formspree error:", result);
                    if (formStatus) {
                        formStatus.textContent =
                            result.errors?.map(error => error.message).join(", ")
                            || "Unable to send message. Please try again.";
                        formStatus.style.color = "#ff5555";
                    }
                }
            } catch (error) {
                // Network error
                console.error("Submission error:", error);
                if (formStatus) {
                    formStatus.textContent =
                        "Network error. Please check your internet connection.";
                    formStatus.style.color = "#ff5555";
                }
            } finally {
                // Restore button
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        });
    } else {
        console.error("Contact form not found! Check your HTML form ID.");
    }
});
