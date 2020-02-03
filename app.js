const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const passport = require('passport');
const auth = require('./auth');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
const func = require('./functions.js')
var db = require('./db/mysql_query');

var generate_key = function() {
    return crypto.randomBytes(16).toString('base64');
}
// HANDLE GET REQUESTS AND POST REQUESTS

var sessionKey = generate_key();
// AUTH START
auth(passport);
app.use(passport.initialize());
app.use(cookieSession({
    name: 'session',
    keys: [sessionKey]
}));
app.use(cookieParser());
// AUTH END
app.set('view engine', 'ejs');
// MAIN
app.get('/', function(req, res) {
    profile = req.session.profile;  
    if (req.session.token) {
        res.cookie('token', req.session.token);
        func.checkLevel(profile).then(function(user) {
            if(user[0]['level'] > 0) {
                res.render('pages/index', { profile: profile, level: user[0]['level'], page: "home", category: "home" });
            } else {
                res.json("YOU ARE NOT AUTHORIZED");
            }
        })
    } else {
        res.cookie('token', '');
        res.redirect('/auth/google');
    }
    
});

app.get('/add-guru', function(req, res) {
    profile = req.session.profile;  
    if (req.session.token) {
        res.cookie('token', req.session.token);
        func.checkLevel(profile).then(function(user) {
            if(user[0]['level'] > 1) {
                res.render('pages/add-guru', { profile: profile, level: user[0]['level'], category: "admin", page: "tambah-guru" });
            } else {
                res.json("YOU ARE NOT AUTHORIZED");
            }
        })
    } else {
        res.cookie('token', '');
        res.redirect('/auth/google');
    }
    
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});
// MAIN END

app.get('/post/teacher-table', function(req, res) {
    if (req.session.token) {
        db.query("select * from users", function(err, result){
            if (err) throw err;
            res.json(result)
            console.log("request received")
        })
    } else {
        res.cookie('token', '')
        res.redirect('/auth/google')
    }
})

// GOOGLE OAUTH BEGIN
app.get('/auth/google', passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        req.session.token = req.user.token;
        req.session.profile = req.user.profile;
        db.query('SELECT * from users where id=?', [ req.user.profile["id"] ], function(error, results) {
            if(results[0] === undefined || results[0].length == 0) {
                db.query('INSERT INTO users (id, nama, email, level) VALUES (?, ?, ?, 0)', [req.user.profile["id"], req.user.profile["displayName"], req.user.profile.emails[0].value], function (err) {
                    if (err) throw err;
                    console.log("1 account inserted");
                })
            }
            console.log()
        } )
        res.redirect('/');
    }
);
// GOOGLE OAUTH END
app.use('/dist',express.static(path.join(__dirname, 'public/html/dist')));
app.use('/plugins',express.static(path.join(__dirname, 'public/html/plugins')));
app.use('/css',express.static(path.join(__dirname, 'public/html')));

app.listen(process.env.port || 3000);

console.log('Running at port 3000');
