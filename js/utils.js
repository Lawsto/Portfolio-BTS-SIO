/**
 * Utilitaires - Fonctions diverses
 */

/**
 * Mise à jour dynamique de l'année dans le footer
 */
export function initFooterYear() {
  const footerParagraph = document.querySelector('footer p');
  if (footerParagraph) {
  const year = new Date().getFullYear();
    footerParagraph.textContent = `© ${year} Fouarge Etienne. Tous droits réservés.`;
  }
}

/**
 * Gestion des erreurs globales
 */
export function initErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('Erreur détectée:', e.error);
  });
}

/**
 * Performance monitoring (optionnel, pour le développement)
 */
export function initPerformanceMonitoring() {
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Temps de chargement de la page: ${pageLoadTime}ms`);
    });
  }
}

