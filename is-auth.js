const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "no authorized Header" });
  }
  const token = authHeader.split(" ")[1];
  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "token");
  } catch {
    res.status(500).json({ message: "could not decode token" });
  }
  if (!decodeToken) {
    res.status(401).json({ message: "unauthorized access" });
  }
  req.userId = decodeToken.userId;
  next();
};
