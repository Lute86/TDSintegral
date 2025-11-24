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
      // DEBUG: Muestra el rol que se está evaluando
      console.log(`Middleware Rol de Usuario: ${req.user ? req.user.rol : 'NULO'}`); 
      console.log(` Roles Permitidos: ${rolesPermitidos.join(', ')}`);

      if (!req.user)
        return HttpResponse.unauthorized(res, { msg: "No autenticado" });

      // Verificación de Rol
      if (!rolesPermitidos.includes(req.user.rol))
        return HttpResponse.forbidden(res, { msg: "Acceso denegado" });

      next();
    };
  }
}