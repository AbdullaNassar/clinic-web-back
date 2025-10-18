import jwt from "jsonwebtoken";

const protectSwagger = function (req, res, next) {
  // The token is extracted from the URL parameters
  const token = req.params.token;

  if (!token) {
    return res.status(401).send("Unauthorized: Token is missing in URL");
  }

  try {
    // Note: process.env is still available if 'dotenv/config' is used in the entry file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "SuperAdmin") {
      return res.status(403).send("Access Denied: SuperAdmin only");
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

// Use export default for the middleware function
export default protectSwagger;
