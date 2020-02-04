const express = require('express')
let router = express.Router()
const auth = require('../auth');
let noToken = require('./auth').noToken
const db = require('../../db/mysql_query');

router.get('/', async function(req, res) {
    profile = req.session.profile;  
    if (req.session.token) {
        res.cookie('token', req.session.token);
        if(await auth.getUserLevel(profile.id) > 0){
            res.render('pages/index', { profile: profile, level: req.session.user['level'], page: "home", category: "home" });
        } else {
            res.json("YOU ARE NOT AUTHORIZED");
        }

    } else {
        noToken(res)
    }
    
});

router.get('/add-guru', async function(req, res) {
    profile = req.session.profile;  
    if (req.session.token) {
        res.cookie('token', req.session.token);
        if(await auth.getUserLevel(profile.id) > 1){
            res.render('pages/add-guru', { profile: profile, level: req.session.user['level'], page: "tambah-guru", category: "admin" });
        } else {
            res.json("YOU ARE NOT AUTHORIZED");
        }
    } else {
        noToken(res)
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});
// MAIN END

router.get('/post/teacher-table', function(req, res) {
    if (req.session.token) {
        db.query("select * from users", function(err, result){
            if (err) throw err;
            res.json(result)
            console.log("request received")
        })
    } else {
        noToken(res)
    }
})

module.exports = {
    router: router
}