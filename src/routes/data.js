const express = require('express')
let router = express.Router()
const auth = require('../auth');
const db = require('../../db/mysql_query');
const bodyParser = require('body-parser')
let fs = require('fs');
var uuid = require("uuid");
var path = require('path');

const multer = require('multer');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/uploads/image')
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
      }
})

let upload = multer({storage: storage})

router.get('/post/teacher-table', auth.roles.can('admin'), function(req, res) {
    db.query("select * from users", function(err, result){
        if (err) throw err;
        res.json(result)
        console.log("request received")
    })
})

router.get('/post/student-table', auth.roles.can('admin'), function(req, res) {
    db.query("SELECT p.nis, p.nama, p.status, p.kelas, k.id_kelas, k.nama_kelas FROM pelajar as p LEFT JOIN kelas AS k ON p.kelas = k.id_kelas", function(err, result){
        if (err) throw err;
        res.json(result)
    })
})

router.get('/post/list-kelas', auth.roles.can('admin'), function(req, res) {
    db.query("SELECT * FROM kelas", function(err, result){
        if (err) throw err;
        res.json(result)
        res.end();
    })
})

router.post('/post/add-guru', auth.roles.can('admin'), function(req, res) {
    console.log(req.body);
    var id = req.body.id;
    var level;
    if (req.body.level == 1) {
        level = 1
    }
    if (req.body.level == 2) {
        level = 2
    }
    db.query("UPDATE users SET level=? WHERE id=?", [level, id], function(err, result){
        if (err) throw err;
        res.status(200)
        console.log(result)
    })
})

router.post('/post/add-siswa', auth.roles.can('admin'), function(req, res) {
    user = req.body;
    console.log(req.file);
    db.query("INSERT INTO pelajar (nama, nis, kelas, telpon, email) VALUES (?, ?, ?, ?, ?)", [user.nama, user.nis, user.kelas, user.telpon, user.email], function(err, result){
        if (err) throw err;
        res.status(200)
        res.end()
        console.log(result)
    })
})

router.post('/post/upload-image-siswa', auth.roles.can('admin'), upload.single('gambarsiswa'), function(req, res) {
    var imageurl = '/public/image/' + req.file.filename;
    db.query("UPDATE pelajar SET foto = ? WHERE nis = ?", [imageurl, req.body.nisn], function(err, result) {
        if (err) throw err;
        res.status(200)
        res.end()
    })    
})

router.post('/post/siswa-data', auth.roles.can('admin'), function(req, res) {
    var id = req.body.id //Get User ID from POST Request Body
    db.query("SELECT * FROM pelajar WHERE nis = ?", [id], function(err, result){
        if (err) throw err;
        console.log("1 request")
        res.json(result)
        res.end()
    })  
})

router.post('/post/name_search', auth.roles.can('loggedIn'), function(req, res) {
    db.query("SELECT nama FROM pelajar", function(err, result){
        if (err) throw err;
        console.log("1 request")
        res.json(result)
        res.end()
    })
})

module.exports = {
    router: router,
}