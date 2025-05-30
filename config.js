import defaults from './default-env.js';
import { configDotenv } from 'dotenv';
const whiteList = Object.keys(defaults);
configDotenv();

function readAllowed(obj) {
  return Object.fromEntries(whiteList.map((key) => [key, obj[key]]).filter((pair) => pair[1]));
}

/** @type {typeof defaults} */
export default {
  ...defaults,
  ...readAllowed(process.env),
};
