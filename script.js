/**
 * Reshmaa Shri E — Personal Portfolio Interactions
 * InAmigos Foundation Task 1
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------------
     Mobile Navigation Toggle
     ------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile drawer when clicking any navigation link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('is-open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        mobileDrawer.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------------------------------
     Active Link Highlighter via IntersectionObserver
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  /* -------------------------------------------------------------------------
     Project Filtering
     ------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
     Project Deep-Dive Modals
     ------------------------------------------------------------------------- */
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const allModals = document.querySelectorAll('.modal-backdrop');

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('is-active');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  allModals.forEach(modal => {
    // Click close button
    const closeBtns = modal.querySelectorAll('.modal-close, .modal-close-btn');
    closeBtns.forEach(cBtn => {
      cBtn.addEventListener('click', () => closeModal(modal));
    });

    // Click outside dialog
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.is-active');
      if (activeModal) closeModal(activeModal);
    }
  });

  /* -------------------------------------------------------------------------
     Toast Notification System
     ------------------------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  /* -------------------------------------------------------------------------
     Copy Email to Clipboard
     ------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const userEmail = 'reshmaashrie@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(userEmail);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = userEmail;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast('✓ Email address copied to clipboard!');
      } catch (err) {
        showToast('Email: ' + userEmail);
      }
    });
  }

  /* -------------------------------------------------------------------------
     Contact Form Handler
     ------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const subject = document.getElementById('sender-subject').value.trim();
      const message = document.getElementById('sender-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Prepare mailto link
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'New Message from ' + name}`);
      const mailtoBody = encodeURIComponent(`Hello Reshmaa,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);
      const mailtoUrl = `mailto:${userEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      showToast('Opening your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);
    });
  }

  /* -------------------------------------------------------------------------
     Back to Top Button
     ------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
