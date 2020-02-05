const express = require('express')
let router = express.Router()
const auth = require('../auth');
let noToken = require('../auth').noToken
const db = require('../../db/mysql_query');
const bodyParser = require('body-parser')
let fs = require('fs');

const multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

let upload = multer({storage: storage})


router.get('/', async function(req, res) {
    if (req.user != null) {
        profile = req.user.profile;  
        if(req.user.level > 0){
            res.render('../../views/pages/index', { profile: profile, level: req.user.level, page: "home", category: "home" });
        } else {
            res.redirect('/unauthorized')
        }

    } else {
        noToken(res)
    }
    
});

router.get('/add-guru', async function(req, res) {
    if (req.user != null) {
        profile = req.user.profile;  
        if(req.user.level > 1){
            res.render('../../views/pages/admin/add-guru', { profile: profile, level: req.user.level, page: "tambah-guru", category: "admin" });
        } else {
            res.redirect('/unauthorized')        
        }
    } else {
        noToken(res)
    }
});

router.get('/add-siswa', async function(req, res) {
    profile = req.session.profile;  
    if (req.user != null) {
        profile = req.user.profile;  
        if(req.user.level > 1){
            res.render('../../views/pages/admin/add-siswa', { profile: profile, level: req.user.level, page: "tambah-siswa", category: "admin" });
        } else {
            res.redirect('/unauthorized')        
        }
    } else {
        noToken(res)
    }
});

router.get('/unauthorized', (req, res) => {
    res.render('../../views/pages/unauthorized')
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});
// MAIN END


router.get('/login', function(req,res) {
    res.render('../../views/pages/login')
})

module.exports = {
    router: router
}