import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const setupServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(pino());

  // GET /notes
  app.get('/notes', (req, res) => {
    res.status(200).json({
      message: 'Retrieved all notes',
    });
  });

  // GET /notes/:noteId
  app.get('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;
    res.status(200).json({
      message: `Retrieved note with ID: ${noteId}`,
    });
  });

  // GET /test-error (Testowanie błędów 500)
  app.get('/test-error', (req, res) => {
    throw new Error('Simulated server error');
  });

  // --- OBSŁUGA BŁĘDÓW ---

  // Middleware dla 404 (Trasa nie znaleziona)
  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  // Middleware dla 500 (Błędy serwera)
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  });

  // Uruchomienie serwera
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupServer();
