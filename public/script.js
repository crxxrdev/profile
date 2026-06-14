document.addEventListener('DOMContentLoaded', () => {
  const viewsEl = document.getElementById('views-count');
  fetch('/api/views', { method: 'POST' })
    .then(r => r.json())
    .then(data => { viewsEl.textContent = data.views.toLocaleString(); })
    .catch(() => { viewsEl.textContent = 'N/A'; });

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard?.writeText(text).then(() => {
        btn.textContent = 'Copied ✓';
        setTimeout(() => btn.textContent = `Discord — ${text}`, 900);
      }).catch(() => alert('Copy: ' + text));
    });
  });
});
