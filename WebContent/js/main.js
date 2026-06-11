document.addEventListener("DOMContentLoaded", function () {
    // 1. Scroll Progress Bar & Sticky Navigation
    const scrollProgress = document.getElementById("scroll-progress");
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", function () {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollProgress) {
            scrollProgress.style.width = scrolled + "%";
        }

        if (winScroll > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navLinkItems = document.querySelectorAll(".nav-link-item");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen = menuToggle.classList.toggle("open");
            navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinkItems.forEach(item => {
            item.addEventListener("click", function () {
                menuToggle.classList.remove("open");
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", false);
            });
        });
    }

    // 3. FAQ Accordion Toggle
    const faqTriggers = document.querySelectorAll(".faq-trigger");

    faqTriggers.forEach(trigger => {
        trigger.addEventListener("click", function () {
            const faqItem = this.parentElement;
            const isOpen = faqItem.classList.contains("active");

            // Close all other open accordion panels for a clean user experience
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".faq-trigger").setAttribute("aria-expanded", false);
                item.querySelector(".faq-state").innerText = "+";
            });

            // Toggle current panel
            if (!isOpen) {
                faqItem.classList.add("active");
                this.setAttribute("aria-expanded", true);
                this.querySelector(".faq-state").innerText = "×";
            }
        });
    });

    // 4. AJAX Form Submission to Java Servlet backend
    const contactForm = document.getElementById("contact-form");
    const successPanel = document.getElementById("form-success");
    const errorPanel = document.getElementById("form-error");
    const successMsg = document.getElementById("success-message");
    const errorMsg = document.getElementById("error-message");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent default page redirect
            
            const submitBtn = document.getElementById("form-submit-btn");
            const originalBtnText = submitBtn.innerText;
            
            // Show sending state
            submitBtn.innerText = "Sending Inquiry...";
            submitBtn.disabled = true;

            const formData = new URLSearchParams();
            for (const pair of new FormData(contactForm)) {
                formData.append(pair[0], pair[1]);
            }

            fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Server returned an error status.");
                }
                return response.json();
            })
            .then(data => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;

                if (data.status === "success") {
                    if (successMsg) successMsg.innerText = data.message;
                    successPanel.classList.add("active");
                    contactForm.reset();
                    
                    // Automatically slide out the success panel after 5 seconds
                    setTimeout(() => {
                        successPanel.classList.remove("active");
                    }, 6000);
                } else {
                    if (errorMsg) errorMsg.innerText = data.message || "An unexpected error occurred.";
                    errorPanel.classList.add("active");
                    
                    setTimeout(() => {
                        errorPanel.classList.remove("active");
                    }, 5000);
                }
            })
            .catch(error => {
                console.error("Submission Error:", error);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                if (errorMsg) errorMsg.innerText = "Failed to connect to backend server. Please check your network connection.";
                errorPanel.classList.add("active");
                
                setTimeout(() => {
                    errorPanel.classList.remove("active");
                }, 5000);
            });
        });
    }
    // 5. Scroll Reveal Intersection Observer
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });
        reveals.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
    }

    // 6. Brand Timeline Slider Logic
    const slides = document.querySelectorAll(".timeline-slide");
    const dots = document.querySelectorAll(".timeline-dot");
    const prevBtn = document.getElementById("timeline-prev");
    const nextBtn = document.getElementById("timeline-next");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
        nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
        
        dots.forEach(dot => {
            dot.addEventListener("click", function() {
                const idx = parseInt(this.getAttribute("data-index"));
                showSlide(idx);
            });
        });
    }

    // 7. Product Detail Modals (Frosted Popups) Logic
    const openModalBtns = document.querySelectorAll(".open-modal-btn");
    const closeModalBtns = document.querySelectorAll(".modal-product-close-btn");
    const modalOverlays = document.querySelectorAll(".modal-overlay-product");

    openModalBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add("active");
                document.body.style.overflow = "hidden"; // Prevent background scrolling
            }
        });
    });

    function closeAllModals() {
        modalOverlays.forEach(modal => modal.classList.remove("active"));
        document.body.style.overflow = ""; // Re-enable background scrolling
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener("click", closeAllModals);
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener("click", function (e) {
            // Close if clicking the outer dimmed backdrop, not the card itself
            if (e.target === this) {
                closeAllModals();
            }
        });
    });

    // Close modal on Escape key press
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });

    // 8. Modal "Select for Inquiry" Actions
    const quickInquireBtns = document.querySelectorAll(".quick-inquire-btn");
    const interestSelect = document.getElementById("form-interest");

    quickInquireBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const interestVal = this.getAttribute("data-interest");
            if (interestSelect) {
                interestSelect.value = interestVal;
            }
            closeAllModals();
            
            // Smooth scroll to the contact form section
            const contactSection = document.getElementById("contact");
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
                
                // Focus on name input for immediate writing
                setTimeout(() => {
                    const nameInput = document.getElementById("form-name");
                    if (nameInput) nameInput.focus();
                }, 800);
            }
        });
    });
});

