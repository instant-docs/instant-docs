import defaults from './default-env.js';
import { configDotenv } from 'dotenv';

configDotenv();

export default {
  ...defaults,
  ...process.env,
};
