// ==========================================
// NAVIGATION
// ==========================================

/**
 * Défilement fluide pour les liens de navigation
 */
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Fermer le menu mobile si ouvert
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Scroll vers la section
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Menu hamburger pour mobile
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isOpen);
    
    // Empêcher le scroll du body quand le menu est ouvert
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Fermer le menu si on clique en dehors
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });
  
  // Fermer le menu sur redimensionnement si on passe en desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ==========================================
// ANIMATIONS
// ==========================================

/**
 * Animations au scroll (Intersection Observer)
 */
function initScrollAnimations() {
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
function initBackToTop() {
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

// ==========================================
// FORMULAIRE DE CONTACT
// ==========================================

/**
 * Gestion du formulaire de contact
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageDiv = document.getElementById('form-message');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };
    
    // Validation
    if (!validateForm(formData, messageDiv)) {
      return;
    }
    
    // Désactiver le bouton pendant l'envoi
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    try {
      // Simulation d'envoi (à remplacer par une vraie API)
      await simulateFormSubmission(formData);
      
      // Succès
      showMessage(messageDiv, 'success', 'Votre message a été envoyé avec succès ! Je vous répondrai bientôt.');
      form.reset();
      
      // Masquer le message après 5 secondes
      setTimeout(() => {
        hideMessage(messageDiv);
      }, 5000);
      
    } catch (error) {
      // Erreur
      showMessage(messageDiv, 'error', 'Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      // Réactiver le bouton
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
  
  // Validation en temps réel
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        emailInput.style.borderColor = '#dc3545';
      } else {
        emailInput.style.borderColor = '';
      }
    });
  }
}

function validateForm(data, messageDiv) {
  if (!data.name || !data.email || !data.message) {
    showMessage(messageDiv, 'error', 'Veuillez remplir tous les champs.');
    return false;
  }
  
  if (data.name.length < 2) {
    showMessage(messageDiv, 'error', 'Le nom doit contenir au moins 2 caractères.');
    return false;
  }
  
  if (!isValidEmail(data.email)) {
    showMessage(messageDiv, 'error', 'Veuillez entrer une adresse email valide.');
    return false;
  }
  
  if (data.message.length < 10) {
    showMessage(messageDiv, 'error', 'Le message doit contenir au moins 10 caractères.');
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(element, type, text) {
  if (!element) return;
  
  element.textContent = text;
  element.className = `form-message ${type}`;
  element.style.display = 'block';
  
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideMessage(element) {
  if (!element) return;
  
  element.style.display = 'none';
  element.className = 'form-message';
}

function simulateFormSubmission(data) {
  const payload = {
    name: data.name,
    email: data.email,
    message: data.message,
    website: (document.getElementById('website')?.value || '').trim()
  };

  return fetch('api/contact.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(async (res) => {
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore
    }

    if (!res.ok) {
      const errMsg = (json && json.error) ? json.error : 'Erreur serveur';
      throw new Error(errMsg);
    }

    if (!json || json.ok !== true) {
      const errMsg = (json && json.error) ? json.error : 'Réponse invalide';
      throw new Error(errMsg);
    }

    return;
  });
}

// ==========================================
// MODALE DE VISUALISATION DES DOCUMENTS
// ==========================================

/**
 * Gestion de la modale de visualisation des documents
 */
function initDocumentModal() {
  const modal = document.getElementById('doc-modal');
  const docBoxes = document.querySelectorAll('.doc-box');
  const closeButtons = document.querySelectorAll('.doc-modal-close, .doc-modal-close-btn');
  const overlay = document.querySelector('.doc-modal-overlay');
  const downloadBtn = document.getElementById('download-doc-btn');
  const openNewTabBtn = document.getElementById('open-new-tab-btn');
  const modalTitle = document.getElementById('modal-title');
  const docViewer = document.getElementById('doc-viewer');
  
  let currentDocUrl = '';
  let currentDocType = '';
  
  if (!modal || docBoxes.length === 0) return;
  
  // Ouvrir la modale au clic
  docBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      e.preventDefault();
      
      const docUrl = box.getAttribute('data-doc');
      const docType = box.getAttribute('data-doc-type');
      const docTitle = box.getAttribute('data-doc-title');
      
      currentDocUrl = docUrl;
      currentDocType = docType;
      
      openModal(docUrl, docType, docTitle);
    });
  });
  
  // Fermer la modale
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    docViewer.innerHTML = '';
    currentDocUrl = '';
    currentDocType = '';
  }
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  overlay.addEventListener('click', closeModal);
  
  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Ouvrir la modale
  function openModal(docUrl, docType, docTitle) {
    modalTitle.textContent = docTitle || 'Document';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadDocument(docUrl, docType);
  }
  
  // Charger le document
  function loadDocument(url, type) {
    if (type === 'pdf') {
      const pdfUrl = `${url}#toolbar=0&navpanes=0&scrollbar=1`;
      
      docViewer.innerHTML = `
        <embed 
          src="${pdfUrl}" 
          type="application/pdf" 
          width="100%" 
          height="100%" 
          style="border:none;display:block;position:absolute;top:0;left:0;right:0;bottom:0;">
      `;
      
      setTimeout(() => {
        const embed = docViewer.querySelector('embed');
        if (!embed || embed.clientHeight === 0) {
          docViewer.innerHTML = `
            <div style="padding: 60px; text-align: center; background: white;">
              <h3 style="color: var(--primary-color); margin-bottom: 20px;">
                Ouverture du document...
              </h3>
              <p style="font-size: 1.1rem; color: #666; margin-bottom: 30px;">
                Le document s'ouvre dans un nouvel onglet pour une meilleure performance.
              </p>
              <p style="font-size: 0.95rem; color: #999;">
                Si le document ne s'ouvre pas, cliquez sur "Ouvrir dans un nouvel onglet" ci-dessous.
              </p>
            </div>
          `;
          window.open(url, '_blank');
        }
      }, 500);
      
    } else {
      window.open(url, '_blank');
      closeModal();
    }
  }
  
  // Ouvrir dans un nouvel onglet
  if (openNewTabBtn) {
    openNewTabBtn.addEventListener('click', () => {
      if (!currentDocUrl) return;
      
      window.open(currentDocUrl, '_blank');
      
      const originalText = openNewTabBtn.innerHTML;
      openNewTabBtn.innerHTML = '<span class="open-icon">✓</span> Ouvert !';
      openNewTabBtn.disabled = true;
      
      setTimeout(() => {
        openNewTabBtn.innerHTML = originalText;
        openNewTabBtn.disabled = false;
      }, 1000);
    });
  }
  
  // Gérer le téléchargement
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!currentDocUrl) return;
      
      const link = document.createElement('a');
      link.href = currentDocUrl;
      link.download = currentDocUrl.split('/').pop();
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      const originalText = downloadBtn.innerHTML;
      const originalBg = downloadBtn.style.background;
      
      downloadBtn.innerHTML = '<span class="download-icon">✓</span> Téléchargement lancé !';
      downloadBtn.style.background = '#28a745';
      downloadBtn.disabled = true;
      
      setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.background = originalBg;
        downloadBtn.disabled = false;
      }, 1500);
    });
  }
}

// ==========================================
// UTILITAIRES
// ==========================================

/**
 * Mise à jour dynamique de l'année dans le footer
 */
function initFooterYear() {
  const footerParagraph = document.querySelector('footer p');
  if (footerParagraph) {
    const year = new Date().getFullYear();
    footerParagraph.textContent = `© ${year} Fouarge Etienne. Tous droits réservés.`;
  }
}

/**
 * Amélioration de la performance - Lazy loading
 */
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
}

/**
 * Gestion des erreurs globales
 */
window.addEventListener('error', (e) => {
  console.error('Erreur détectée:', e.error);
});

/**
 * Performance monitoring
 */
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Temps de chargement de la page: ${pageLoadTime}ms`);
  });
}

// ==========================================
// INITIALISATION
// ==========================================

/**
 * Gestion de l'accordéon pour tous les projets
 */
function initProjetAccordion() {
  const toggleBtns = document.querySelectorAll('.projet-toggle-btn');
  
  if (toggleBtns.length === 0) return;
  
  toggleBtns.forEach(toggleBtn => {
    const controlsId = toggleBtn.getAttribute('aria-controls');
    const detailsSection = document.getElementById(controlsId);
    
    if (!detailsSection) return;
    
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        // Fermer
        toggleBtn.setAttribute('aria-expanded', 'false');
        detailsSection.classList.remove('show');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = 'Voir plus de détails';
        }
      } else {
        // Ouvrir
        toggleBtn.setAttribute('aria-expanded', 'true');
        detailsSection.classList.add('show');
        const toggleText = toggleBtn.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = 'Voir moins de détails';
        }
      }
    });
  });
}

/**
 * Gestion du sidebar (menu latéral)
 */
function initSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      const isOpen = sidebar.classList.contains('open');
      sidebarToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Fermer le sidebar au clic sur un lien (mobile)
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Mettre à jour le lien actif selon la page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  sidebarLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  initSmoothScrolling();
  initFooterYear();
  initScrollAnimations();
  initBackToTop();
  initMobileMenu();
  initContactForm();
  initDocumentModal();
  initLazyLoading();
  initProjetAccordion();
});

