/**
 * Animations - Gestion des animations au scroll et du bouton retour en haut
 */

/**
 * Animations au scroll (Intersection Observer)
 */
export function initScrollAnimations() {
  const sections = document.querySelectorAll('section');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.id !== 'hero') {
    section.classList.add('hidden');
    observer.observe(section);
    }
  });
}

/**
 * Bouton retour en haut
 */
export function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (!backToTopButton) return;
  
  // Afficher/masquer le bouton selon le scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });
  
  // Action au clic
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Amélioration de la performance - Lazy loading pour les images
 */
export function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback pour les navigateurs anciens
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
}

