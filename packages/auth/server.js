import './src/config/env.js';
import app from './src/app.js';
import { env } from './src/config/env.js';

// Starts the Express server on the configured port
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
