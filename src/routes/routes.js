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
    if(req.user == null) { res.redirect('/login') }
    profile = req.user.profile;  
    res.render('pages/index', { profile: profile, level: req.user.level, page: "home", category: "home" });
});

router.get('/add-guru', auth.roles.can('admin'), async function(req, res) {
    res.render('pages/admin/add-guru', { profile: profile, level: req.user.level, page: "tambah-guru", category: "admin" });
});

router.get('/add-siswa', auth.roles.can('admin'), async function(req, res) {
    res.render('pages/admin/add-siswa', { profile: profile, level: req.user.level, page: "tambah-siswa", category: "admin" });
});

router.get('/piket', auth.roles.can('loggedIn'), async function(req, res) {
    res.render('pages/guru/piket', { profile: profile, level: req.user.level, page: "piket", category: "guru" });
});

module.exports = {
    router: router
}