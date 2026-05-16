import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

dotenv.config();

const setupServer = async () => {
  const app = express();

  // 3. Podłączenie standardowych middleware (w tym Twój nowy logger z pino)
  app.use(logger);
  app.use(express.json());
  app.use(cors());

  // 4. Rejestracja tras (przeniesione do zewnętrznego routera, usunięto /test-error)
  app.use(notesRouter);

  // 6. Middleware dla nieistniejących tras (404) - teraz z osobnego pliku
  app.use(notFoundHandler);

  // 7. Globalny error handler (500) - teraz z osobnego pliku
  app.use(errorHandler);

  // 2. Połączenie z MongoDB przed uruchomieniem serwera
  await connectMongoDB();

  // Uruchomienie serwera
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

setupServer();
