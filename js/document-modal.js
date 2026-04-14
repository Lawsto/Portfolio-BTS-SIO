/**
 * Modale de visualisation des documents
 */

/**
 * Gestion de la modale de visualisation des documents
 */
export function initDocumentModal() {
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
  let cachedIframe = null; // Cache de l'iframe pour éviter les rechargements
  
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
    }, { passive: false });
  });
  
  // Fermer la modale 
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Nettoyage immédiat 
    docViewer.innerHTML = '';
    currentDocUrl = '';
    currentDocType = '';
    cachedIframe = null;
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
    
    // Afficher et charger simultanément 
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadDocument(docUrl, docType);
  }
  
  // Charger le document 
  function loadDocument(url, type) {
    if (type === 'pdf') {
      // Pas de loader, affichage direct pour performance maximale
      // Paramètres PDF ultra-optimisés
      const pdfUrl = `${url}#toolbar=0&navpanes=0&scrollbar=1`;
      
      // Création directe de l'embed sans container intermédiaire
      docViewer.innerHTML = `
        <embed 
          src="${pdfUrl}" 
          type="application/pdf" 
          width="100%" 
          height="100%" 
          style="border:none;display:block;position:absolute;top:0;left:0;right:0;bottom:0;">
      `;
      
      // Alternative : ouvrir directement dans un nouvel onglet si l'embed échoue
      setTimeout(() => {
        const embed = docViewer.querySelector('embed');
        if (!embed || embed.clientHeight === 0) {
          // Si l'embed ne fonctionne pas, afficher un message et ouvrir dans un nouvel onglet
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
      // Autres types : ouvrir directement dans un nouvel onglet
      window.open(url, '_blank');
      closeModal();
    }
  }
  
  // Ouvrir dans un nouvel onglet (solution optimale pour les gros PDF)
  if (openNewTabBtn) {
    openNewTabBtn.addEventListener('click', () => {
      if (!currentDocUrl) return;
      
      // Ouvrir dans un nouvel onglet
      window.open(currentDocUrl, '_blank');
      
      // Feedback visuel
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
      
      // Créer un lien temporaire pour télécharger
      const link = document.createElement('a');
      link.href = currentDocUrl;
      link.download = currentDocUrl.split('/').pop();
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Feedback visuel optimisé
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

