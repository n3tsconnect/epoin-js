const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = (passport) => {
    var allowed = []

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: process.env.PASSPORT_GOOGLE_CLIENTID,
            clientSecret: process.env.PASSPORT_GOOGLE_CLIENTSECRET,
            callbackURL: "http://" + process.envPASSPORT_GOOGLE_CALLBACKDOMAIN + "/auth/google/callback"
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
