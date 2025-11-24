import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Employee } from "../models/Employee.model.js";

// CRÍTICO: Aseguramos que la clave de verificación se obtenga del ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'admin123'; 

// 🚨 DEPURACIÓN CRÍTICA: Muestra la clave que se usará para VERIFICAR el token.
console.log('🚨 PASSPORT_SECRET USADO PARA VERIFICACIÓN:', JWT_SECRET); 

export class Passport {
  // El constructor ya no necesita recibir el secreto.
  constructor() {
    // this.secret = JWT_SECRET;
  }

  initialize() {
    const opts = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        req => req?.cookies?.token || null, // lee token de cookie si existe
      ]),
      // Ahora lee la clave globalmente definida arriba (o del ambiente)
      secretOrKey: JWT_SECRET 
    };

    const strategy = new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // La clave en el payload del token es 'id' (visto en el test)
        console.log('🔍 Passport intentando buscar Employee ID:', jwt_payload.id); // 🚨 DEBUG: Muestra el ID del token
        
        // 1. Intentar buscar al empleado en la DB
        const user = await Employee.findById(jwt_payload.id); 
        
        if (user) {
            console.log('✅ Passport encontró usuario. Rol:', user.rol); // 🚨 DEBUG: Éxito
            return done(null, user);
        }
        
        // 2. Si no lo encuentra
        console.log('❌ Passport NO encontró usuario para el ID:', jwt_payload.id); // 🚨 DEBUG: Fallo
        return done(null, false);
      } catch (err) {
        console.error('❌ Passport Error en DB:', err.message); // 🚨 DEBUG: Error de Mongoose/DB
        return done(err, false);
      }
    });

    passport.use(strategy);
    return passport.initialize();
  }

  static authenticate() {
    return passport.authenticate("jwt", { session: false });
  }
}