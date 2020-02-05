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

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});
// MAIN END


router.get('/login', function(req,res) {
    res.render('pages/login')
})

router.get('/unauthorized', (req, res) => {
    res.render('pages/unauthorized')
});

module.exports = {
    router: router,
}