import express from 'express';
import path from 'path';

const PORT = Number(process.env.PORT) || 8080;

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(PORT, () => console.log(`Ready on http://localhost:${PORT}`));
