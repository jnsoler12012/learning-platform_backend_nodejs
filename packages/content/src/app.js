import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import routes from './presentation/routes/index.js';
import { errorHandler } from './presentation/middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(resolve(__dirname, '../public')));
app.use('/uploads', express.static(resolve(__dirname, '../uploads')));

app.use('/api/v1', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'content-service' });
});

app.use(errorHandler);

export default app;
