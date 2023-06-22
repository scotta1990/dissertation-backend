const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token)
    return res.status(403).send("A token is required for authentication");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};
