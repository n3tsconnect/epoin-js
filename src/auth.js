const knex = require('../db/knex')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function initAuth(passport) {

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
}

async function getUserLevel(id){
    let level = await knex('users').select('level').where('id', id).first()
    return level.level
}

async function getUserFullInfo(id){
    return await knex('users').where('id', id).first()
}

module.exports = {
    initAuth: initAuth,
    getUserLevel: getUserLevel,
    getUserFullInfo: getUserFullInfo
}