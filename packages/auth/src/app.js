import express from 'express';
import cors from 'cors';
import routes from './presentation/routes/index.js';
import { errorHandler } from './presentation/middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Mounts all API routes under /api/v1
app.use('/api/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'learning-platform-v1' });
});

// Global error handler (must be registered after routes)
app.use(errorHandler);

export default app;
