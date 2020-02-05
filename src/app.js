const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const passport = require('passport');
const auth = require('./auth');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session')
const crypto = require('crypto');
var db = require('../db/mysql_query');
const knex = require('../db/knex');

app.use(express.urlencoded());
app.use(express.json());

var generate_key = function() {
    return crypto.randomBytes(16).toString('base64');
}
// HANDLE GET REQUESTS AND POST REQUESTS

var sessionKey = generate_key();
app.use(cookieParser());

auth.initAuth(passport);
app.use(cookieSession({
    name: 'session',
    keys: [sessionKey]
}));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session())
app.set('view engine', 'ejs');

app.use('/', require('./routes/routes').router)
app.use('/', require('./routes/auth').router)
app.use('/', require('./routes/data').router)

app.use('/dist',express.static(path.join(__dirname, '../public/html/dist')));
app.use('/plugins',express.static(path.join(__dirname, '../public/html/plugins')));
app.use('/css',express.static(path.join(__dirname, '../public/html')));

app.listen(process.env.port || 3000);

console.log('Running at port 3000');
