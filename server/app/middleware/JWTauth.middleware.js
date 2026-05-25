import jwt from "jsonwebtoken";

// Middleware
export const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: "Token Not Found" });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Token generator
export const generateToken = (userData) => {
  return jwt.sign(
    {
      id: userData._id,
      email: userData.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
};
