const knex = require('../db/knex')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const nanoid = require('nanoid')
const ConnectRoles = require('connect-roles')

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
    async (token, refreshToken, profile, done) => {
        const fetchedUser = await knex('users').select(['id']).where('google_id', profile.id)
        let level
        if(fetchedUser.length == 0){
            await knex('users').insert({id: nanoid(), email: profile.emails[0].value, google_id: profile.id, nama: profile.displayName, level: 1})
            level = 1
            console.log("1 new user!")
        } else {
            console.log("existing")
            const levelFetch = await knex('users').select('level').where('google_id', profile.id).first()
            level = levelFetch.level
            let tempGoogleId = profile.id
            profile.id = fetchedUser.id
            profile.google_id = tempGoogleId
        }

        done(null, {
            profile: profile,
            token: token,
            level: level
        });
    }));
}

let roles = new ConnectRoles({
    failureHandler: (req, res, act) => {
        res.redirect('/unauthorized')
    }
})

roles.use(function (req, act) {
    if(req.user == null){ console.log("HIT"); return act === 'anonymous' }
})

roles.use('loggedIn', (req) => {
    if(req.user.level > 0){ return true }
})

roles.use('admin', (req) => {
    if(req.user.level > 1){ return true }
})

function loginCheck(req, res, next){
    if(req.user == null){ res.redirect('/login') }
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
    getUserFullInfo: getUserFullInfo,
    loginCheck: loginCheck,
    roles: roles
}