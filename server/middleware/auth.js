import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ message: "No Token, authorization denied" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }
  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid" });
  }
}
