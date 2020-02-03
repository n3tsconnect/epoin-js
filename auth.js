const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
            clientID: process.env.PASSPORT_GOOGLE_CLIENTID,
            clientSecret: process.env.PASSPORT_GOOGLE_CLIENTSECRET,
            callbackURL: process.env.PASSPORT_GOOGLE_CALLBACKDOMAIN + "/auth/google/callback"
        },
        (token, refreshToken, profile, done) => {
            console.log(profile);
                return done(null, {
                    profile: profile,
                    token: token
                });
        }));
};
