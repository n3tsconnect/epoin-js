const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const auth = require('./auth');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const sessionKey = Math.floor(100000 + Math.random() * 900000);
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
    if (req.session.token) {
        res.cookie('token', req.session.token);
        res.render('pages/index', { profile: req.session.profile });
    } else {
        res.cookie('token', '');
        res.redirect('/auth/google')
    }
});



app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});
// MAIN END
// GOOGLE OAUTH BEGIN
app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        req.session.token = req.user.token;
        req.session.profile = req.user.profile;
        res.redirect('/');
    }
);
// GOOGLE OAUTH END
app.use('/dist',express.static(path.join(__dirname, 'public/html/dist')));
app.use('/plugins',express.static(path.join(__dirname, 'public/html/plugins')));
app.use('/css',express.static(path.join(__dirname, 'public/html')));

app.listen(process.env.port || 3000);

console.log('Running at port 3000');
