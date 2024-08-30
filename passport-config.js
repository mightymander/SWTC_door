const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, get_user_by_email, get_user_by_id) {
  const authenticate_user = async (email, password, done) => {
    console.log("Authenticating user...");
    console.log("Login Attempt: ", email, password);
    const user = await get_user_by_email(email);
    console.log("getting user by email, User: ", user);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      console.log("Comparing password...");
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password or Email incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticate_user)
  );
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await get_user_by_id(id);
      done(null, user);
    } catch (e) {
      done(e);
    }
  });
}

module.exports = initialize;
