/**
 * ============================================================================
 * PORTFOLIO CLIENT-SIDE SCRIPT (Vanilla JavaScript ES6+)
 * Author: Hassan Abdulganiu Oladimeji
 * Purpose: Handles mobile navigation, scroll spy, and contact form validation.
 * ============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initMobileNav();
  initScrollHeader();
  initScrollSpy();
  initContactForm();
  initDownloadCvPrompt();
});

/* ----------------------------------------------------------------------------
 * 1. MOBILE NAVIGATION TOGGLE
 * Handles opening/closing the mobile drawer and manages accessibility (ARIA).
 * ------------------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  // Toggle mobile navigation when hamburger button is clicked
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle active state classes
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    
    // Update ARIA state for screen readers
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
  });

  // Close the mobile drawer whenever a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close the mobile drawer if the user clicks anywhere outside of the menu
  document.addEventListener('click', (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ----------------------------------------------------------------------------
 * 2. HEADER SCROLL EFFECT
 * Adds an elevated shadow/border to the header when user scrolls down.
 * ------------------------------------------------------------------------- */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    // If scrolled past 30px, add a subtle class
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ----------------------------------------------------------------------------
 * 3. SCROLL SPY (ACTIVE NAVIGATION LINK HIGHLIGHTER)
 * Highlights the nav link matching the section currently in viewport.
 * Uses modern IntersectionObserver for high performance.
 * ------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  // IntersectionObserver detects when a section enters or leaves the screen
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Trigger when section occupies the upper part of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ----------------------------------------------------------------------------
 * 4. CONTACT FORM VALIDATION
 * Robust client-side validation with real-time feedback and accessibility.
 * ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const subjectInput = document.getElementById('userSubject');
  const messageInput = document.getElementById('userMessage');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  // Helper function to display field-specific error
  function setError(inputElement, errorElementId, message) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) errorEl.textContent = message;
    inputElement.classList.add('input-error');
  }

  // Helper function to clear field-specific error
  function clearError(inputElement, errorElementId) {
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) errorEl.textContent = '';
    inputElement.classList.remove('input-error');
  }

  // Real-time input listeners: clear error as soon as user types
  nameInput.addEventListener('input', () => clearError(nameInput, 'nameError'));
  emailInput.addEventListener('input', () => clearError(emailInput, 'emailError'));
  subjectInput.addEventListener('input', () => clearError(subjectInput, 'subjectError'));
  messageInput.addEventListener('input', () => clearError(messageInput, 'messageError'));

  // Email format validator using standard RFC 5322 regex
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
  }

  // Form submission handler
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Stop default browser page reload

    let isValid = true;

    // Validate Name
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      setError(nameInput, 'nameError', 'Please enter your full name.');
      isValid = false;
    } else if (nameVal.length < 2) {
      setError(nameInput, 'nameError', 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(nameInput, 'nameError');
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setError(emailInput, 'emailError', 'Please enter your email address.');
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      setError(emailInput, 'emailError', 'Please enter a valid email address (e.g., name@example.com).');
      isValid = false;
    } else {
      clearError(emailInput, 'emailError');
    }

    // Validate Subject
    const subjectVal = subjectInput.value.trim();
    if (!subjectVal) {
      setError(subjectInput, 'subjectError', 'Please enter a subject.');
      isValid = false;
    } else if (subjectVal.length < 3) {
      setError(subjectInput, 'subjectError', 'Subject must be at least 3 characters.');
      isValid = false;
    } else {
      clearError(subjectInput, 'subjectError');
    }

    // Validate Message
    const messageVal = messageInput.value.trim();
    if (!messageVal) {
      setError(messageInput, 'messageError', 'Please enter your message.');
      isValid = false;
    } else if (messageVal.length < 10) {
      setError(messageInput, 'messageError', 'Message should be at least 10 characters long.');
      isValid = false;
    } else {
      clearError(messageInput, 'messageError');
    }

    // If validation fails, focus the first invalid input
    if (!isValid) {
      const firstInvalid = form.querySelector('.input-error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // If valid: Send real email via FormSubmit AJAX service directly to your Gmail
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending message...</span>`;

    fetch('https://formsubmit.co/ajax/abdulganiuhassan6@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: messageVal,
        _subject: `New Portfolio Message from ${nameVal}: ${subjectVal}`
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      formStatus.className = 'form-status show success';
      formStatus.textContent = `Thank you, ${nameVal}! Your message has been sent successfully to Hassan's inbox.`;
      form.reset();
    })
    .catch(error => {
      console.error('Submission error:', error);
      formStatus.className = 'form-status show error';
      formStatus.textContent = `Sorry, there was an issue sending your message. Please reach out directly to abdulganiuhassan6@gmail.com.`;
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Send Message</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      `;

      // Auto-hide the message banner after 8 seconds
      setTimeout(() => {
        formStatus.classList.remove('show');
      }, 8000);
    });
  });
}

/* ----------------------------------------------------------------------------
 * 5. DOWNLOAD CV HELPER
 * Friendly tooltip/notification until real CV document is uploaded.
 * ------------------------------------------------------------------------- */
function initDownloadCvPrompt() {
  const cvBtn = document.getElementById('downloadCvBtn');
  if (!cvBtn) return;

  cvBtn.addEventListener('click', (e) => {
    // If the href is still a placeholder anchor (#contact)
    if (cvBtn.getAttribute('href') === '#contact') {
      // Let it scroll smoothly to contact or provide a friendly note
      console.log('CV Download: In production, place your CV PDF file into an assets/ folder and link directly.');
    }
  });
}
