const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const viewsFile = path.join(__dirname, 'views.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readViews() {
  try {
    const data = await fs.readFile(viewsFile, 'utf8');
    const obj = JSON.parse(data);
    return typeof obj.views === 'number' ? obj.views : 0;
  } catch (e) {
    return 0;
  }
}

async function writeViews(n) {
  await fs.writeFile(viewsFile, JSON.stringify({ views: n }, null, 2), 'utf8');
}

app.get('/api/views', async (req, res) => {
  const v = await readViews();
  res.json({ views: v });
});

app.post('/api/views', async (req, res) => {
  const v0 = await readViews();
  const v = v0 + 1;
  await writeViews(v);
  res.json({ views: v });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
