// js/onlineIcon.js
// Replace violent "online" icon with a friendly trophy/medal icon SVG (non-violent).
// Usage: call replaceOnlineIcons() after DOM loaded.

export function replaceOnlineIcons(selector = '.player-online-icon') {
  const nodes = document.querySelectorAll(selector);
  nodes.forEach(n => {
    if (n.dataset.replaced === '1') return;
    const svg = `
      <svg class="online-trophy" width="18" height="18" viewBox="0 0 24 24" role="img" aria-label="Jogando">
        <path fill="currentColor" d="M5 3h14v3a4 4 0 0 1-4 4h-6A4 4 0 0 1 5 6V3z"/>
        <path fill="currentColor" d="M7 14a5 5 0 0 0 10 0h2a2 2 0 0 0 2-2V9h-2a7 7 0 0 1-14 0H3v3a2 2 0 0 0 2 2h2z"/>
      </svg>
    `;
    n.innerHTML = svg;
    n.setAttribute('title','Jogando agora');
    n.dataset.replaced = '1';
  });
}
