function parseCookies(req, res, next) {
  const rawCookies = req.headers.cookie;

  if (rawCookies) {
    const cookies = {};
    rawCookies.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const key = parts[0].trim();
      const value = parts[1] ? decodeURIComponent(parts[1].trim()) : '';

      cookies[key] = value;
    });

    req.cookies = cookies;
  }

  next();
}

module.exports = parseCookies;
