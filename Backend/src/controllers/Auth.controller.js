import { AuthService } from "../services/Auth.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

export class AuthController {
   static async login(req, res) {
    try {
      const { email, password, rol } = req.body;
      const authService = new AuthService(process.env.JWT_SECRET);
      const data = await authService.login(email, password, rol);

      // Guardar token JWT en cookie segura
      res.cookie("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 8 * 60 * 60 * 1000,
      });

      // Si la request viene desde un navegador → redirigir al dashboard
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect("/dashboard");
      }

      // Si es una request API → responder en JSON
      return HttpResponse.success(res, data);

    } catch (err) {

      // Si es un formulario HTML → renderiza el login con mensaje de error
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.status(401).render("landingpage", { error: err.message });
      }

      // Si es una llamada API → responde con JSON
      return HttpResponse.unauthorized(res, { msg: err.message });
    }
  }

  static logout(req, res) {
    res.clearCookie("token");
    return res.redirect("/");
  }

}
