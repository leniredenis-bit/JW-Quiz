// js/tagsWidget.js
// Renders top 7 tags and exposes a "Ver mais" painel.
// Usage:
//  const tagsCounts = [{ tag: 'gênesis', count: 50 }, ...]
//  renderTagsWidget(document.getElementById('tags-root'), tagsCounts);

export function renderTagsWidget(rootElem, tagsCounts = []) {
  if (!rootElem) return;
  const maxVisible = 7;

  tagsCounts.sort((a,b)=>b.count - a.count);

  rootElem.innerHTML = '';
  const visibleWrap = document.createElement('div');
  visibleWrap.className = 'tags-visible';
  const moreBtn = document.createElement('button');
  moreBtn.id = 'tags-more-btn';
  moreBtn.className = 'tags-more-btn';
  moreBtn.setAttribute('aria-expanded','false');
  moreBtn.textContent = '+ Ver mais';

  const morePanel = document.createElement('div');
  morePanel.id = 'tags-more-panel';
  morePanel.className = 'tags-more-panel';
  morePanel.hidden = true;

  tagsCounts.slice(0, maxVisible).forEach(t => {
    const btn = makeTagButton(t.tag);
    visibleWrap.appendChild(btn);
  });

  tagsCounts.slice(maxVisible).forEach(t => {
    const btn = makeTagButton(t.tag);
    morePanel.appendChild(btn);
  });

  moreBtn.onclick = () => {
    const expanded = moreBtn.getAttribute('aria-expanded') === 'true';
    moreBtn.setAttribute('aria-expanded', String(!expanded));
    morePanel.hidden = expanded;
    moreBtn.textContent = expanded ? '+ Ver mais' : '- Ver menos';
  };

  rootElem.appendChild(visibleWrap);
  if (tagsCounts.length > maxVisible) {
    rootElem.appendChild(moreBtn);
    rootElem.appendChild(morePanel);
  }
}

function makeTagButton(tag) {
  const btn = document.createElement('button');
  btn.className = 'tag-btn';
  btn.textContent = tag;
  btn.dataset.tag = tag;
  btn.onclick = () => {
    document.dispatchEvent(new CustomEvent('tagSelected', { detail: { tag } }));
  };
  return btn;
}
