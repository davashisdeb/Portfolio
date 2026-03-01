/* =========================================================
   DAVASHIS DEB — Civil Engineering Portfolio
   script.js
   ========================================================= */

// ---- Theme Toggle ---- //
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ---- Hamburger Menu ---- //
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Navbar Scroll Effect ---- //
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
});

// ---- Active Nav Link on Scroll ---- //
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
    if (!link) return;
    if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ---- Hero Typed Effect ---- //
const typedEl = document.getElementById('heroTyped');
const phrases = [
  'Civil Engineer',
  'Structural Designer',
  'Survey Specialist',
  'Infrastructure Enthusiast',
  'B.Sc. Graduate – SEC',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeEffect() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => { deleting = true; typeEffect(); }, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, deleting ? 60 : 100);
}
typeEffect();

// ---- Scroll Reveal ---- //
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children if inside a grid
      entry.target.style.transitionDelay = `${(entry.target.dataset.delay || 0)}ms`;
      entry.target.classList.add('visible');
      // Animate skill bars when they come into view
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Stagger items inside grids
function applyStagger(containerSelector, itemSelector) {
  document.querySelectorAll(containerSelector).forEach(container => {
    container.querySelectorAll(itemSelector).forEach((item, i) => {
      item.dataset.delay = i * 100;
    });
  });
}
applyStagger('.projects-grid', '.project-card');
applyStagger('.skills-grid',   '.skills-block');
applyStagger('.timeline',      '.timeline-item');

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Project Filter ---- //
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// ---- Modal ---- //
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
  // Stop video if playing — reload iframe src
  const iframe = document.querySelector(`#${id} iframe`);
  if (iframe) { iframe.src = iframe.src; }
}

function closeAllModals() {
  document.querySelectorAll('.modal.active').forEach(m => {
    m.classList.remove('active');
    const iframe = m.querySelector('iframe');
    if (iframe) iframe.src = iframe.src;
  });
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// ---- Contact Form (mailto fallback) ---- //
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value.trim();
  const message = document.getElementById('formMessage').value.trim();

  // Build mailto link
  const mailtoLink = `mailto:davashisdeb@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
  window.location.href = mailtoLink;

  formStatus.textContent = '✓ Opening your email client...';
  setTimeout(() => { formStatus.textContent = ''; }, 4000);
});

// ---- Smooth anchor scroll for all internal links ---- //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
    }
  });
});
