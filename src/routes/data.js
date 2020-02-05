const express = require('express')
let router = express.Router()
const auth = require('../auth');
let noToken = require('../auth').noToken
const db = require('../../db/mysql_query');
const bodyParser = require('body-parser')
var fs = require('fs');

const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({storage: storage})

router.get('/post/teacher-table', function(req, res) {
    if (req.user != null) {
        db.query("select * from users", function(err, result){
            if (err) throw err;
            res.json(result)
            console.log("request received")
        })
    } else {
        noToken(res)
    }
})

router.get('/post/student-table', function(req, res) {
    if (req.user != null) {
        db.query("SELECT p.nis, p.nama, p.status, p.kelas, k.id_kelas, k.nama_kelas FROM pelajar as p LEFT JOIN kelas AS k ON p.kelas = k.id_kelas", function(err, result){
            if (err) throw err;
            res.json(result)
        })
    } else {
        noToken(res)
    }
})

router.get('/post/list-kelas', function(req, res) {
    if (req.user != null) {
        db.query("SELECT * FROM kelas", function(err, result){
            if (err) throw err;
            res.json(result)
        })
    } else {
        noToken(res)
    }
})

router.post('/post/add-guru', function(req, res) {
    console.log(req.body);
    var id = req.body.id;
    var level;
    if (req.body.level == 1) {
        level = 1
    }
    if (req.body.level == 2) {
        level = 2
    }
   if (req.user = !null) {
        db.query("UPDATE users SET level=? WHERE id=?", [level, id], function(err, result){
            if (err) throw err;
            res.status(200)
            console.log(result)
        })
    } else {
        noToken(res)
    }
})

router.post('/post/add-siswa', upload.single('gambarSiswa'), function(req, res) {
    user = req.body;
    if (req.user = !null) {
        db.query("INSERT INTO pelajar (nama, nis, kelas, telpon, email) VALUES (?, ?, ?, ?, ?)", [user.nama, user.nis, user.kelas, user.telpon, user.email], function(err, result){
            if (err) throw err;
            res.status(200)
            res.end()
            console.log(result)
        })
    } else {
        noToken(res)
    }
})





module.exports = {
    router: router,
}