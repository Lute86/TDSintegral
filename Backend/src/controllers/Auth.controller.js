import { AuthService } from "../services/Auth.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";


export class AuthController {
   static async login(req, res) {
    try {
      const { email, password, rol } = req.body;
      const authService = new AuthService(process.env.JWT_SECRET);
      const data = await authService.login(email, password, rol);

      
      res.cookie("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 8 * 60 * 60 * 1000,
      });

      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect("/dashboard");
      }

      return HttpResponse.success(res, data);

    } catch (err) {

      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        return res.redirect("/?authError=true");
      }

      return HttpResponse.unauthorized(res, { msg: err.message });
    }
  }

  static logout(req, res) {
    res.clearCookie("token");
    return res.redirect("/");
  }

}
