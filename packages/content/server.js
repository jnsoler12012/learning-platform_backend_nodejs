import './src/config/env.js';
import app from './src/app.js';
import { env } from './src/config/env.js';

app.listen(env.PORT, () => {
  console.log(`Content service running on port ${env.PORT}`);
});
