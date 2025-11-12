import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { AuthValidator } from "../middlewares/validators/auth.validator.js";

class AuthRoutes {
  static getRouter() {
    const router = Router();

    //  Página principal pública (Landing)
    router.get("/landingpage", (req, res) => {
      res.render("landingpage");
    });

    //  Redirigir "/" al landing (por comodidad)
    router.get("/", (req, res) => {
      res.redirect("/auth/landingpage");
    });
    
    // POST → Login con validación
    router.post("/login", AuthValidator.validateLogin, AuthController.login);

    // GET → Logout (borra cookie y redirige al landing page)
    router.get("/logout", AuthController.logout);

    return router;
  }
}

export default AuthRoutes;
