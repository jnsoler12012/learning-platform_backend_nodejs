import './src/config/env.js';
import app from './src/app.js';
import { env } from './src/config/env.js';

// Starts the BFF gateway server on the configured port and host
const HOST = process.env.HOST || '0.0.0.0';
app.listen(env.PORT, HOST, () => {
  console.log(`Gateway (BFF) running on ${HOST}:${env.PORT}`);
});
