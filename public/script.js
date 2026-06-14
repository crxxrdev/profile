document.addEventListener('DOMContentLoaded', () => {
  const viewsEl = document.getElementById('views-count');
  fetch('/api/views', { method: 'POST' })
    .then(r => r.json())
    .then(data => { viewsEl.textContent = data.views.toLocaleString(); })
    .catch(() => { viewsEl.textContent = 'N/A'; });

  // simple link click copies the username
  document.querySelectorAll('.link').forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = btn.textContent.replace('Discord:', '').trim();
      navigator.clipboard?.writeText(txt).then(() => {
        btn.textContent = 'Copied ✓';
        setTimeout(() => location.reload(), 700);
      }).catch(() => alert('Copy: ' + txt));
    });
  });
});
