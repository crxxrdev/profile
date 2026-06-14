document.addEventListener('DOMContentLoaded', () => {
  const viewsEl = document.getElementById('views-count');
  // Increment view count on load
  fetch('/api/views', { method: 'POST' })
    .then(r => r.json())
    .then(data => { viewsEl.textContent = data.views.toLocaleString(); })
    .catch(() => { viewsEl.textContent = 'N/A'; });

  // copy buttons
  document.querySelectorAll('button.copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard?.writeText(text).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      }).catch(() => {
        alert('Copy: ' + text);
      });
    });
  });
});
