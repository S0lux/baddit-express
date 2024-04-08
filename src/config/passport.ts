import passportLocal from "passport-local";
import { userRepository } from "../repositories/userRepository";
import { compareHash } from "../utils/hashFunctions";
import passport from "passport";

const LocalStrategy = passportLocal.Strategy;

const strategy = new LocalStrategy(function verify(username, password, done) {
  userRepository
    .getUserByUsername(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      if (compareHash(password, user.hashedPassword) === false) {
        return done(null, false);
      }
      const newUser = {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        emailVerified: user?.emailVerified,
        registeredAt: user?.registeredAt,
        role: user?.role,
      };
      return done(null, newUser);
    })
    .catch((err) => done(err));
});

passport.use(strategy);

passport.serializeUser((user: any, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  userRepository
    .getUserById(id)
    .then((user) => {
      const newUser = {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        avatarUrl: user?.avatarUrl,
        emailVerified: user?.emailVerified,
        registeredAt: user?.registeredAt,
        role: user?.role,
      };
      return done(null, newUser as Express.User);
    })
    .catch((err) => done(err));
});
