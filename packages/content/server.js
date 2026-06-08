import './src/config/env.js';
import app from './src/app.js';
import { env } from './src/config/env.js';

const HOST = process.env.HOST || '0.0.0.0';
app.listen(env.PORT, HOST, () => {
  console.log(`Content service running on ${HOST}:${env.PORT}`);
});
