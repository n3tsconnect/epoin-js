const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = (passport) => {
    var allowed = [
        "112778240035515513676",
    ]

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: "913025732460-12klt42ibnronhehhcutju930be1ccrn.apps.googleusercontent.com",
            clientSecret: "s67Rf6cVoa0lXicwjVqFJ4YZ",
            callbackURL: "http://localhost:3000/auth/google/callback"
        },
        (token, refreshToken, profile, done) => {
            console.log(profile);
            if (allowed.includes(profile["id"])){
                return done(null, {
                    profile: profile,
                    token: token
                });
            }
            else {
                done(new Error("Your account is not authorized!"));
            }
        }));
};