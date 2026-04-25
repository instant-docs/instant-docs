import defaults from './default-env.js';
const whiteList = Object.keys(defaults);

function readAllowed(obj) {
  return Object.fromEntries(whiteList.map((key) => [key, obj[key]]).filter((pair) => pair[1] !== undefined));
}

/** @type {typeof defaults} */
export default {
  ...defaults,
  ...readAllowed(process.env),
};
