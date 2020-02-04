const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const passport = require('passport');
const auth = require('./auth');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const crypto = require('crypto');
var db = require('../db/mysql_query');
const knex = require('../db/knex');

var generate_key = function() {
    return crypto.randomBytes(16).toString('base64');
}
// HANDLE GET REQUESTS AND POST REQUESTS

var sessionKey = generate_key();
// AUTH START
auth.initAuth(passport);
app.use(passport.initialize());
app.use(cookieSession({
    name: 'session',
    keys: [sessionKey]
}));
app.use(cookieParser());
// AUTH END
app.set('view engine', 'ejs');

// Inject user info to request variable
app.use(async (req, res, next) => {
    if(req.session.profile != null){
        req.session.user = await auth.getUserFullInfo(req.session.profile.id)
        next()
    } else {
        next()
    }
})

app.use('/', require('./routes/routes').router)
app.use('/auth', require('./routes/auth').router)

// GOOGLE OAUTH END
app.use('/dist',express.static(path.join(__dirname, '../public/html/dist')));
app.use('/plugins',express.static(path.join(__dirname, '../public/html/plugins')));
app.use('/css',express.static(path.join(__dirname, '../public/html')));

app.listen(process.env.port || 3000);

console.log('Running at port 3000');
