/**
 * Fichier principal - Point d'entrée de l'application
 */

// Import des modules
import { initSmoothScrolling, initMobileMenu } from './navigation.js';
import { initScrollAnimations, initBackToTop, initLazyLoading } from './animations.js';
import { initContactForm } from './contact-form.js';
import { initDocumentModal } from './document-modal.js';
import { initFooterYear, initErrorHandling, initPerformanceMonitoring } from './utils.js';

/**
 * Initialisation de l'application
 */
document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  initSmoothScrolling();
  initMobileMenu();
  
  // Animations
  initScrollAnimations();
  initBackToTop();
  initLazyLoading();
  
  // Composants
  initContactForm();
  initDocumentModal();
  
  // Utilitaires
  initFooterYear();
  initErrorHandling();
  initPerformanceMonitoring();
});

