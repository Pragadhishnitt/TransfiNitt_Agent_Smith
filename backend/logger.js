// Simple request logger middleware
// Logs method, url, status, and duration. Redacts Authorization header and password fields.
const redact = (obj) => {
  try {
    if (!obj || typeof obj !== 'object') return obj;
    const clone = JSON.parse(JSON.stringify(obj));
    if (clone.headers && clone.headers.authorization) clone.headers.authorization = '[REDACTED]';
    if (clone.body) {
      if (typeof clone.body === 'object') {
        if (clone.body.password) clone.body.password = '[REDACTED]';
        if (clone.body.password_hash) clone.body.password_hash = '[REDACTED]';
      }
    }
    return clone;
  } catch (e) {
    return obj;
  }
};

module.exports = function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url } = req;

  // on finish, log status and time
  res.on('finish', () => {
    const duration = Date.now() - start;
    const safeReq = {
      method,
      url,
      headers: { authorization: req.headers.authorization },
      body: req.body
    };

    console.log(`[${new Date().toISOString()}] ${method} ${url} ${res.statusCode} - ${duration}ms`, redact(safeReq));
  });

  next();
};
