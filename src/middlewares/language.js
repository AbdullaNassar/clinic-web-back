function languageMiddleware(req, res, next) {
  // Default to 'ar' if no language is specified in the 'lang' header
  // If the requested language isn't supported, it defaults to 'en'
  const supportedLanguages = ["en", "ar"];
  let language = req.headers["lang"] || "ar";

  if (!supportedLanguages.includes(language)) {
    language = "en";
  }

  req.language = language;
  next();
}

export default languageMiddleware;
