// Global ripple helper: listens for clicks on elements with `data-ripple`
// and injects a transient span to animate ripple.
function createRipple(event) {
  const el = event.target.closest('[data-ripple]');
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  const size = Math.max(rect.width, rect.height) * 1.2;
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  ripple.style.position = 'absolute';
  ripple.style.transformOrigin = 'center';
  el.style.position = el.style.position || 'relative';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

export default function initRipple() {
  if (typeof window === 'undefined') return;
  document.addEventListener('click', createRipple, { passive: true });
}
