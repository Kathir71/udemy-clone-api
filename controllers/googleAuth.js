const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../models/userModel")
const findOrCreate = require("mongoose-findorcreate");
passport.use(UserModel.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile,cb) {
      console.log(accessToken);
      console.log(refreshToken)
      UserModel.findOrCreate(
        { googleId: profile.id, userName: profile._json.name , userEmail:profile._json.email},
        function (err, user) {
        console.log(profile);
          return cb(err, user);
        }
      );
    }
  )
);
passport.use(UserModel.createStrategy());
module.exports = passport;