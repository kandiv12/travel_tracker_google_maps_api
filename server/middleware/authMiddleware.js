import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(
    token,
    process.env.SECRET_KEY || "your_secret_key",
    (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid Token" });
      req.user = user;
      next();
    }
  );
};

export default authenticateToken;
