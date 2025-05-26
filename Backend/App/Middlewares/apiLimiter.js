// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

// Configure a per-route limiter: max 50 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 10,                  // limit each IP to 50 requests per window
  standardHeaders: true,    // return rate limit info in the RateLimit-* headers
  legacyHeaders: false,     // disable the X-RateLimit-* headers
  message: {
    status: 429,
    error: "Too many requests – please try again later.",
  },
});

module.exports = apiLimiter;
