const express = require('express')
let router = express.Router()
const passport = require('passport');
const db = require('../../db/mysql_query');

router.get('/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        req.session.token = req.user.token;
        req.session.profile = req.user.profile;
        db.query('SELECT * from users where id=?', [ req.user.profile["id"] ], function(error, results) {
            if(results[0] === undefined || results[0].length == 0) {
                db.query('INSERT INTO users (id, nama, email, level) VALUES (?, ?, ?, 1)', [req.user.profile["id"], req.user.profile["displayName"], req.user.profile['emails'][0].value], function (err) {
                    if (err) throw err;
                    console.log("1 account inserted");
                })
            }
            console.log()
        } )
        res.redirect('/');
    }
);

function noToken(res){
    res.cookie('token', '');
    res.redirect('/login');
}

module.exports = {
    router: router,
    noToken: noToken
}