const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." ,status: false });
  }


  try {
    const decoded = jwt.verify(token, process.env.SECRET); // JWT_SECRET also okay
    req.user = decoded; // user id etc. available here
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
