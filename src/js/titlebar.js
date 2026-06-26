/**
 * Custom Title Bar Controls
 */
document.addEventListener('DOMContentLoaded', () => {
  const btnMin = document.getElementById('btn-minimize');
  const btnMax = document.getElementById('btn-maximize');
  const btnClose = document.getElementById('btn-close');

  if (btnMin) btnMin.addEventListener('click', () => window.electronAPI.minimize());
  if (btnMax) btnMax.addEventListener('click', () => window.electronAPI.maximize());
  if (btnClose) btnClose.addEventListener('click', () => window.electronAPI.close());
});
