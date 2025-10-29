import { AuthService } from "../services/Auth.service.js";
import HttpResponse from "../utils/HttpResponse.utils.js";

export class AuthController {
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
}
