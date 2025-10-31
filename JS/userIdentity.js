// js/userIdentity.js
// Gera/recupera um id anônimo para o usuário (localStorage).
export function getOrCreateAnonymousId() {
  const key = "quiz:anon_id_v1";
  let id = localStorage.getItem(key);
  if (id) return id;
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    id = crypto.randomUUID();
  } else {
    id = 'anon-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*1e6).toString(36);
  }
  localStorage.setItem(key, id);
  return id;
}

export function resetAnonymousId() {
  localStorage.removeItem("quiz:anon_id_v1");
}
