// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const faqItems = document.querySelectorAll(".faq-item");
const contactForm = document.getElementById("contactForm");
const backToTopBtn = document.getElementById("backToTop");
const newsletterForm = document.querySelector(".newsletter-form");
const body = document.body;

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDark) {
    body.setAttribute("data-theme", "dark");
    updateThemeIcon("dark");
  }
}

function toggleTheme() {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  if (theme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

// Mobile Menu
function toggleMobileMenu() {
  navMenu.classList.toggle("mobile-menu");
  hamburger.classList.toggle("active");
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
  navMenu.classList.remove("mobile-menu");
  hamburger.classList.remove("active");
}

// FAQ Accordion
function toggleFAQ(item) {
  const isActive = item.classList.contains("active");

  // Close all FAQ items
  faqItems.forEach((faqItem) => {
    faqItem.classList.remove("active");
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    item.classList.add("active");
  }
}

// Scroll Reveal Animation
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, observerOptions);

  // Observe all elements that should animate on scroll
  const revealElements = document.querySelectorAll(
    ".website-card, .review-card, .course-card, .note-card"
  );
  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

// Active Navigation on Scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }

      // Close mobile menu after clicking
      closeMobileMenu();
    });
  });
}

// Contact Form Handling
function handleContactForm(e) {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !message) {
    showFormMessage("Please fill in all fields", "error");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage("Please enter a valid email address", "error");
    return;
  }

  // Simulate form submission
  showFormMessage(
    "Thank you for your message! We'll get back to you soon.",
    "success"
  );

  // Reset form
  contactForm.reset();
}

function showFormMessage(message, type) {
  // Remove existing message
  const existingMessage = contactForm.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;

  // Style the message
  messageDiv.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 20px;
        font-weight: 500;
        text-align: center;
    `;

  if (type === "success") {
    messageDiv.style.backgroundColor = "#d1fae5";
    messageDiv.style.color = "#065f46";
    messageDiv.style.border = "1px solid #a7f3d0";
  } else {
    messageDiv.style.backgroundColor = "#fee2e2";
    messageDiv.style.color = "#991b1b";
    messageDiv.style.border = "1px solid #fca5a5";
  }

  // Insert message before submit button
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  contactForm.insertBefore(messageDiv, submitBtn);

  // Auto remove message after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Back to Top Button Functionality
function initBackToTop() {
  // Show/hide button based on scroll position
  function toggleBackToTop() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollPosition > windowHeight / 2) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Event listeners
  window.addEventListener("scroll", throttle(toggleBackToTop, 100));
  backToTopBtn.addEventListener("click", scrollToTop);

  // Initial check
  toggleBackToTop();
}

// Newsletter Form Handling
function handleNewsletterForm(e) {
  e.preventDefault();

  const emailInput = newsletterForm.querySelector(".newsletter-input");
  const email = emailInput.value.trim();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    showNewsletterMessage("Please enter your email address", "error");
    return;
  }

  if (!emailRegex.test(email)) {
    showNewsletterMessage("Please enter a valid email address", "error");
    return;
  }

  // Simulate newsletter subscription
  showNewsletterMessage(
    "Thank you for subscribing! You'll receive our latest updates.",
    "success"
  );

  // Reset form
  emailInput.value = "";
}

function showNewsletterMessage(message, type) {
  // Remove existing message
  const existingMessage = newsletterForm.querySelector(".newsletter-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `newsletter-message ${type}`;
  messageDiv.textContent = message;

  // Style the message
  messageDiv.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 15px;
        font-weight: 500;
        text-align: center;
        font-size: 14px;
    `;

  if (type === "success") {
    messageDiv.style.backgroundColor = "#d1fae5";
    messageDiv.style.color = "#065f46";
    messageDiv.style.border = "1px solid #a7f3d0";
  } else {
    messageDiv.style.backgroundColor = "#fee2e2";
    messageDiv.style.color = "#991b1b";
    messageDiv.style.border = "1px solid #fca5a5";
  }

  // Insert message after form
  newsletterForm.appendChild(messageDiv);

  // Auto remove message after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Loading Animation
function initLoadingAnimation() {
  const elements = document.querySelectorAll(
    ".website-card, .review-card, .course-card, .note-card"
  );
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
  });
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initTheme();

  // Initialize scroll reveal
  initScrollReveal();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize loading animation
  initLoadingAnimation();

  // Initialize back to top button
  initBackToTop();

  // Event Listeners
  themeToggle.addEventListener("click", toggleTheme);
  hamburger.addEventListener("click", toggleMobileMenu);
  contactForm.addEventListener("submit", handleContactForm);

  // Newsletter form listener
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterForm);
  }

  // FAQ accordion listeners
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => toggleFAQ(item));
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Update active navigation on scroll
  window.addEventListener("scroll", updateActiveNavLink);

  // Initial check for active navigation
  updateActiveNavLink();

  // Add loading class to body for initial animation
  setTimeout(() => {
    body.classList.add("loading");
  }, 100);
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll event
window.addEventListener("scroll", throttle(updateActiveNavLink, 100));

// Add some interactive effects
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effect to buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0)";
    });
  });

  // Add click ripple effect to cards
  const cards = document.querySelectorAll(
    ".website-card, .review-card, .course-card, .note-card"
  );
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("div");
      ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      card.style.position = "relative";
      card.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
});

// Handle window resize for mobile menu
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Escape key closes mobile menu
  if (e.key === "Escape") {
    closeMobileMenu();
  }
});

// Add touch support for mobile
let touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
  if (!navMenu.classList.contains("mobile-menu")) return;

  const touchY = e.touches[0].clientY;
  const diff = touchStartY - touchY;

  // Prevent scrolling when mobile menu is open
  if (Math.abs(diff) > 10) {
    e.preventDefault();
  }
});
