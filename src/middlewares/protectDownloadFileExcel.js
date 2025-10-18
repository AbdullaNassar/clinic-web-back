// middlewares/protectSwagger.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.params.token;

  if (!token) {
    return res.status(401).send("Unauthorized: Token is missing in URL");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    

    if (decoded.role !== "SuperAdmin" && decoded.role !== "Admin") {
      return res.status(403).send("Access Denied: SuperAdmin or Admin");
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
