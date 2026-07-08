export { ICONS } from './icons';

export function mergeRefs(...refs) {
  return (el) => refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') ref(el);
    else ref.current = el;
  });
}

const _injected = new Set();
export function injectStyles(id, css) {
  if (_injected.has(id) || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);
  _injected.add(id);
}
