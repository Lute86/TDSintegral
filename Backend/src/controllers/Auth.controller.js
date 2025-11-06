import { AuthService } from "../services/Auth.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";
import cookieParser from "cookie-parser";


export class AuthController {
  /*
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const authService = new AuthService(process.env.JWT_SECRET);
      const data = await authService.login(email, password);
      HttpResponse.success(res, data);
    } catch (err) {
      HttpResponse.unauthorized(res, { msg: err.message });
    }
  }

  static logout(req, res) {
  res.clearCookie("token");
  res.redirect("/auth/login");
}*/

static async login(req, res) {
  try {
    const { email, password } = req.body;
    const authService = new AuthService(process.env.JWT_SECRET);
    const data = await authService.login(email, password);

    // Guardar token en cookie HTTP-Only
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: false, // cambiar a true si usás HTTPS en producción
      maxAge: 8 * 60 * 60 * 1000 // 8 horas
    });

    // Si viene desde un form web → redirect al dashboard
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.redirect("/dashboard");
    }

    // Si es una request API → devolver JSON
    return HttpResponse.success(res, data);

  } catch (err) {
    return HttpResponse.unauthorized(res, { msg: err.message });
  }
}

static logout(req, res) {
  res.clearCookie("token");
  res.redirect("/"); // vuelve a landing o login
}
}
