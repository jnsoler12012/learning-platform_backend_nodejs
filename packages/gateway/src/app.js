import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { env } from './config/env.js';

const app = express();

app.use(cors());
app.use(express.json());
// Mounts all BFF endpoints under /api/student
app.use('/api/student', routes);

// Global error handler returning structured JSON
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
});

export default app;
