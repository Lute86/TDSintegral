import HttpResponse from "../../utils/HttpResponse.utils.js";

export class AuthMiddleware {

  static isAuthenticated(req, res, next) {
    if (!req.user) {
      return HttpResponse.unauthorized(res, { msg: "No autenticado" });
    }
    next();
  }

  
  static authorize(...rolesPermitidos) {
    return (req, res, next) => {
      if (!req.user)
        return HttpResponse.unauthorized(res, { msg: "No autenticado" });

      if (!rolesPermitidos.includes(req.user.rol))
        return HttpResponse.forbidden(res, { msg: "Acceso denegado" });

      next();
    };
  }
}

