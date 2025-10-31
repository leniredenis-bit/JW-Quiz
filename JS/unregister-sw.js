// Dev helper: desregistra todos os Service Workers e limpa caches ao carregar a página.
// Use apenas em desenvolvimento. Remova este arquivo antes de publicar em produção.
(function() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker API não suportada neste navegador.');
    return;
  }

  window.addEventListener('load', function() {
    // Desregistrar todos os SWs
    navigator.serviceWorker.getRegistrations()
      .then(regs => Promise.all(regs.map(r => r.unregister()).map(p => p.catch(e => { console.warn('Erro ao desregistrar SW:', e); }))))
      .then(() => console.log('Service Worker(s) desregistrado(s) (dev helper).'))
      .catch(err => console.warn('Erro ao listar/desregistrar SWs:', err));

    // Limpar caches
    if (window.caches && caches.keys) {
      caches.keys()
        .then(keys => Promise.all(keys.map(k => caches.delete(k))))
        .then(() => console.log('Caches limpos (dev helper).'))
        .catch(err => console.warn('Erro ao limpar caches:', err));
    }

    // Forçar remoção de dados de storage opcionais (não obrigatório)
    try {
      // localStorage.clear(); // *Opcional* - não limpar por padrão
    } catch (e) {
      // ignore
    }

    // Pequeno feedback visual
    console.log('unregister-sw.js executado. Recarregue a página se necessário.');
  });
})();
