// ========================================
// VenaLabs x Kraken — App Logic
// ========================================

// Supabase config
const SUPABASE_URL = 'https://jgckcuklkjaojugfgcyj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnY2tjdWtsa2phb2p1Z2ZnY3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzgwOTYsImV4cCI6MjA4ODgxNDA5Nn0.1ndTyiOEY3jLGqLpgzTYtYSQdPQrtwTxh3E4tKA_-lA';

// Form submission
const form = document.getElementById('lead-form');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) return;

  // Show loader
  btnText.textContent = 'Envoi en cours...';
  btnLoader.classList.remove('hidden');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ name, email })
    });

    if (response.ok) {
      form.classList.add('hidden');
      formSuccess.classList.remove('hidden');
    } else {
      const error = await response.json();
      if (error.code === '23505') {
        // Duplicate email
        alert('Cet email est déjà enregistré ! Vous faites déjà partie de la communauté.');
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  } catch (err) {
    alert('Erreur de connexion. Vérifiez votre connexion internet.');
  } finally {
    btnText.textContent = 'Rejoindre VenaLabs';
    btnLoader.classList.add('hidden');
  }
});

// Scroll animations with staggered delays
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Stagger children within a grid
      const parent = entry.target.parentElement;
      if (parent && (parent.classList.contains('cards-grid') ||
          parent.classList.contains('ink-grid') ||
          parent.classList.contains('features-grid'))) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(entry.target);
        entry.target.style.animationDelay = `${index * 0.12}s`;
      }
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .ink-card, .feature, .signup-block, .kraken-block, .section-header').forEach((el) => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Mouse-follow glow effect on cards
document.querySelectorAll('.card, .ink-card, .feature').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', x + '%');
    el.style.setProperty('--mouse-y', y + '%');
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.style.background = 'rgba(13, 11, 20, 0.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(13, 11, 20, 0.85)';
    navbar.style.boxShadow = 'none';
  }
  lastScroll = scrollY;
});
