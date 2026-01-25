import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// API demo
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend connected successfully 🚀'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});