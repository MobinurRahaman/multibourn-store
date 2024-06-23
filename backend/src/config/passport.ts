import passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifiedCallback,
  StrategyOptions,
} from "passport-jwt";
import User from "../models/UserModel";

interface JwtPayload {
  userId: string;
}

const secretOrKey = process.env.ACCESS_TOKEN_SECRET!;
console.log("secretOrKey", secretOrKey);

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
};

passport.use(
  new JwtStrategy(opts, async (payload: JwtPayload, done: VerifiedCallback) => {
    try {
      const user = await User.findById(payload.userId);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
