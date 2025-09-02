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

  // Initialize bundle animations
  initBundleAnimations();

  // Initialize bundle scroll animations
  initBundleScrollAnimations();

  // Initialize bundle scroll reveal
  updateScrollReveal();

  // Initialize bundle elements visibility after a short delay
  setTimeout(() => {
    const bundleLeft = document.querySelector('.bundle-left');
    const bundleRight = document.querySelector('.bundle-right');

    if (bundleLeft) {
      bundleLeft.style.opacity = '1';
      bundleLeft.style.transform = 'translateY(0)';
    }

    if (bundleRight) {
      setTimeout(() => {
        bundleRight.style.opacity = '1';
        bundleRight.style.transform = 'translateY(0)';
      }, 200);
    }
  }, 300);

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

// Canvas-based Confetti Animation
class ConfettiCanvas {
  constructor() {
    this.canvas = document.getElementById('confetti-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isActive = false;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle(x, y) {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce',
      '#85c1e9', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c',
      '#3498db', '#e67e22', '#2ecc71', '#f1c40f', '#34495e',
      '#ff4757', '#ffa502', '#3742fa', '#ff6348', '#7bed9f'
    ];

    return {
      x: x || Math.random() * this.canvas.width,
      y: y || Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 14, // Slightly increased velocity
      vy: Math.random() * -10 - 4, // Slightly increased upward velocity
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5, // Slightly larger particles
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15, // Gentle rotation
      gravity: 0.08, // Light gravity
      opacity: 1,
      life: 100 + Math.random() * 50 // Extended life span
    };
  }

  start(x, y, particleCount = 150) {
    if (this.isActive) return;

    this.isActive = true;
    this.particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle(x, y));
    }

    this.animate();
  }

  animate() {
    // Clear canvas completely for better performance
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(particle => {
      // Update particle physics
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += particle.rotationSpeed;
      particle.life--;

      // Simple fade out
      particle.opacity = Math.max(0, particle.opacity - 0.015);

      // Draw particle with subtle glow
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;

      // Add subtle shadow for glow effect
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = 3;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;

      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(particle.rotation);

      // Main rectangle shape
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.4);

      // Add small highlight for larger particles
      if (particle.size > 8) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = particle.opacity * 0.6;
        this.ctx.fillRect(-particle.size / 4, -particle.size / 4, particle.size / 6, particle.size / 6);
      }

      this.ctx.restore();

      return particle.life > 0;
    });

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.isActive = false;
      // Clear canvas immediately for better performance
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Initialize confetti canvas
let confettiCanvas;



// Compact Bundle Section Interactive Animations
function initBundleAnimations() {
  const bundleSection = document.querySelector('.bundle-section');
  const bundleImage = document.querySelector('.bundle-image-compact');
  const bundleBtn = document.querySelector('.bundle-btn-compact');
  const features = document.querySelectorAll('.feature-compact');

  // Initialize confetti canvas
  if (!confettiCanvas) {
    confettiCanvas = new ConfettiCanvas();
  }

  // Intersection Observer for bundle section - trigger confetti on first visit
  let hasTriggeredConfetti = false;
  const bundleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasTriggeredConfetti) {
        hasTriggeredConfetti = true;

        // Trigger confetti animation after a short delay
        setTimeout(() => {
          const rect = bundleSection.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Enhanced confetti burst on section visit
          confettiCanvas.start(centerX, centerY, 120);

          // Add a small follow-up burst
          setTimeout(() => {
            confettiCanvas.start(centerX, centerY, 80);
          }, 300);
        }, 500);

        // Trigger other animations
        triggerBundleAnimations();
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });

  if (bundleSection) {
    bundleObserver.observe(bundleSection);
  }

  function triggerBundleAnimations() {
    // Animate features with stagger
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.style.opacity = '1';
        feature.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Enhanced hover effects for bundle image
  if (bundleImage) {
    bundleImage.addEventListener('mouseenter', () => {
      bundleImage.style.transform = 'translateY(-8px) scale(1.03)';
      bundleImage.style.boxShadow = '0 30px 60px rgba(37, 99, 235, 0.3), 0 15px 35px rgba(37, 99, 235, 0.2)';

      // Small confetti burst on hover
      const rect = bundleImage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setTimeout(() => {
        confettiCanvas.start(centerX, centerY, 60);
      }, 200);
    });

    bundleImage.addEventListener('mouseleave', () => {
      bundleImage.style.transform = 'translateY(0) scale(1)';
      bundleImage.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2), 0 10px 25px rgba(37, 99, 235, 0.1)';
    });
  }

  // Enhanced button click animation with confetti
  if (bundleBtn) {
    bundleBtn.addEventListener('click', (e) => {
      // Create celebration confetti effect
      const rect = bundleBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Enhanced celebration confetti effect
      confettiCanvas.start(centerX, centerY, 100);

      // Add a small follow-up burst
      setTimeout(() => {
        confettiCanvas.start(centerX, centerY, 70);
      }, 250);

      // Add button press animation
      bundleBtn.style.transform = 'translateY(-1px) scale(0.98)';
      setTimeout(() => {
        bundleBtn.style.transform = 'translateY(-3px) scale(1)';
      }, 150);

      // Add ripple effect
      createButtonRipple(bundleBtn, e);
    });
  }

  // Feature hover animations
  features.forEach((feature) => {
    feature.addEventListener('mouseenter', () => {
      feature.style.transform = 'translateX(5px) scale(1.02)';
      feature.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.2)';
    });

    feature.addEventListener('mouseleave', () => {
      feature.style.transform = 'translateX(0) scale(1)';
      feature.style.boxShadow = '0 6px 15px rgba(37, 99, 235, 0.15)';
    });
  });
}

// Create ripple effect for button
function createButtonRipple(button, event) {
  const ripple = document.createElement('div');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: buttonRipple 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  `;

  button.style.position = 'relative';
  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Removed screen shake for lighter performance

// Add ripple animation CSS
if (typeof document !== 'undefined' && !document.querySelector('#button-ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'button-ripple-styles';
  style.textContent = `
    @keyframes buttonRipple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Enhanced scroll-triggered animations for bundle section
function initBundleScrollAnimations() {
  const bundleSection = document.querySelector('.bundle-section');
  const bundleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add visible class to trigger CSS animations
        bundleSection.classList.add('bundle-visible');

        // Trigger counter animations
        animateBundleStats();
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  if (bundleSection) {
    bundleObserver.observe(bundleSection);
  }
}

// Animate bundle statistics
function animateBundleStats() {
  const statNumbers = document.querySelectorAll('.bundle-stats-compact .stat-compact');

  statNumbers.forEach((stat, index) => {
    setTimeout(() => {
      stat.style.opacity = '1';
      stat.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// Add bundle section to scroll reveal
function updateScrollReveal() {
  const bundleElements = document.querySelectorAll('.bundle-right, .bundle-left, .bundle-features-compact, .bundle-price-compact');
  bundleElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `all 0.5s ease ${index * 0.1}s`;

    // Trigger reveal when bundle section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    observer.observe(element);
  });
}

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
