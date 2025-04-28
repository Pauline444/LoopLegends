// Mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const asideContainer = document.querySelector('.aside-container');
  const menuOverlay = document.getElementById('menu-overlay');
  
  // Toggle aside when hamburger button is clicked
  hamburgerBtn.addEventListener('click', () => {
    asideContainer.classList.toggle('mobile-menu-open');
    hamburgerBtn.classList.toggle('is-active');
    menuOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close aside when a user is clicked on mobile
  document.addEventListener('click', (e) => {
    if (e.target.closest('.aside-user') && window.innerWidth <= 768) {
      asideContainer.classList.remove('mobile-menu-open');
      hamburgerBtn.classList.remove('is-active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Close menu when overlay is clicked
  menuOverlay.addEventListener('click', () => {
    asideContainer.classList.remove('mobile-menu-open');
    hamburgerBtn.classList.remove('is-active');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // If window is resized to desktop size while mobile menu is open, close it
    if (window.innerWidth > 768 && asideContainer.classList.contains('mobile-menu-open')) {
      asideContainer.classList.remove('mobile-menu-open');
      hamburgerBtn.classList.remove('is-active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
});