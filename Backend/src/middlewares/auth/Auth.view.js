import { Passport } from "../../config/Passport.config.js";

export const requireAuthView = [
  Passport.authenticate(),
  (req, res, next) => {
    if (!req.user) return res.redirect("/auth/login");
    next();
  }
];