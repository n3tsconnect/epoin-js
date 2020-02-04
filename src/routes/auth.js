const express = require('express')
let router = express.Router()
const passport = require('passport');
const db = require('../../db/mysql_query');

router.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google',
        successRedirect: '/'
    }),
);

module.exports = {
    router: router,
}