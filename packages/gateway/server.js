import './src/config/env.js';
import app from './src/app.js';
import { env } from './src/config/env.js';

// Starts the BFF gateway server on the configured port
app.listen(env.PORT, () => {
  console.log(`Gateway (BFF) running on port ${env.PORT}`);
});
