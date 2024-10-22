import config from '../config.js';

export default function detectLanguage(req, res, next) {
  // Get the 'accept-language' header from the request
  const acceptLanguage = req.headers['accept-language'];

  if (acceptLanguage) {
    // Split the languages and get the first one
    const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0]);
    // Set the detected language to the request object
    res.locals.detectedLanguage = languages[0]; // You can change the logic here as needed
  } else {
    // Default language if none is provided
    res.locals.detectedLanguage = config.DEFAULT_LANG; // Fallback to English
  }

  // Call the next middleware
  next();
}
