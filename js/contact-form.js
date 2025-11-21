/**
 * Formulaire de contact - Gestion et validation
 */

/**
 * Gestion du formulaire de contact
 */
export function initContactForm() {
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

/**
 * Validation du formulaire
 */
function validateForm(data, messageDiv) {
  // Vérifier que tous les champs sont remplis
  if (!data.name || !data.email || !data.message) {
    showMessage(messageDiv, 'error', 'Veuillez remplir tous les champs.');
    return false;
  }
  
  // Vérifier le nom (au moins 2 caractères)
  if (data.name.length < 2) {
    showMessage(messageDiv, 'error', 'Le nom doit contenir au moins 2 caractères.');
    return false;
  }
  
  // Vérifier l'email
  if (!isValidEmail(data.email)) {
    showMessage(messageDiv, 'error', 'Veuillez entrer une adresse email valide.');
    return false;
  }
  
  // Vérifier le message (au moins 10 caractères)
  if (data.message.length < 10) {
    showMessage(messageDiv, 'error', 'Le message doit contenir au moins 10 caractères.');
    return false;
  }
  
  return true;
}

/**
 * Validation de l'email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Afficher un message de feedback
 */
function showMessage(element, type, text) {
  if (!element) return;
  
  element.textContent = text;
  element.className = `form-message ${type}`;
  element.style.display = 'block';
  
  // Scroll vers le message
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Masquer le message
 */
function hideMessage(element) {
  if (!element) return;
  
  element.style.display = 'none';
  element.className = 'form-message';
}

/**
 * Simulation d'envoi de formulaire
 * NOTE: À remplacer par une vraie intégration backend
 * Exemples: FormSpree, EmailJS, ou votre propre API
 */
function simulateFormSubmission(data) {
  return new Promise((resolve, reject) => {
    // Simuler un délai réseau
    setTimeout(() => {
      console.log('Données du formulaire:', data);
      
      // Pour l'instant, toujours réussir
      // Dans un cas réel, vous enverriez les données à un serveur
      resolve();
      
      // Pour simuler une erreur, décommentez la ligne suivante:
      // reject(new Error('Erreur réseau'));
    }, 1500);
  });
}

