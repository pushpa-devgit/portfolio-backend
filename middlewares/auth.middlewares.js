import jwt from "jsonwebtoken";

import User from "../models/user.models.js";

export const isAuthenticated = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SALT);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  }

  res.status(401).json({ message: "Unauthorized" });
};
