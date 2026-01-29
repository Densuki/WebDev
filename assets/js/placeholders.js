/**
 * Placeholders Client-Side Helper
 * Para uso dinâmico no navegador (se necessário)
 */

class PlaceholdersClient {
  constructor() {
    this.data = {};
    this.init();
  }

  async init() {
    try {
      // Carrega configurações (se estiverem disponíveis)
      const response = await fetch('/assets/json/placeholders.json');
      this.data = await response.json();
      this.applyDynamicContent();
    } catch (error) {
      console.log('Placeholders: Modo estático ativo');
    }
  }

  applyDynamicContent() {
    // Exemplo: Atualiza o ano no footer dinamicamente
    const yearElements = document.querySelectorAll('[data-year]');
    if (yearElements.length > 0) {
      const currentYear = new Date().getFullYear();
      yearElements.forEach(el => {
        el.textContent = el.textContent.replace('{{YEARS}}', `2025-${currentYear}`);
      });
    }

    // Exemplo: Atualiza skills dinamicamente
    const skillsContainer = document.getElementById('skills-list');
    if (skillsContainer && this.data.content?.SKILLS) {
      skillsContainer.innerHTML = this.data.content.SKILLS
        .map(skill => `<li>${skill}</li>`)
        .join('');
    }
  }

  // Método para buscar um valor específico
  get(key, defaultValue = '') {
    const keys = key.split('.');
    let value = this.data;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }
}

// Inicializa automaticamente
if (typeof window !== 'undefined') {
  window.placeholders = new PlaceholdersClient();
}