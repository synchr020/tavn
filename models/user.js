const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require("passport-google-oauth20");
const findOrCreate = require("mongoose-findorcreate");
const passport = require("passport"); 

const UserSchema = new Schema({
    googleId: String,
    name: String,
    email:{
        type: String,
        required: true,
        unique: true
    }
    
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.plugin(findOrCreate);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "https://tavn.cyclic.app/auth/google/callback",
         passReqToCallback:true
      
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

module.exports = mongoose.model("User",UserSchema);