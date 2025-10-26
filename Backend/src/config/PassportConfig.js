import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Employee } from "../models/Employee.model.js";

export class PassportConfig {
  constructor(secret) {
    this.secret = secret;
  }

  initialize() {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.secret
    };

    const strategy = new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await Employee.findById(jwt_payload.id);
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
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
