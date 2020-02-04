const express = require('express')
let router = express.Router()
const auth = require('../auth');
let noToken = require('../auth').noToken
const db = require('../../db/mysql_query');
const bodyParser = require('body-parser')

router.get('/', async function(req, res) {
    if (req.user != null) {
        profile = req.user.profile;  
        if(req.user.level > 0){
            res.render('pages/index', { profile: profile, level: req.user.level, page: "home", category: "home" });
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
            res.render('pages/add-guru', { profile: profile, level: req.user.level, page: "tambah-guru", category: "admin" });
        } else {
            res.redirect('/unauthorized')        
        }
    } else {
        noToken(res)
    }
});

router.get('/add-siswa', async function(req, res) {
    profile = req.session.profile;  
    if (req.session.token) {
        res.cookie('token', req.session.token);
        if(await auth.getUserLevel(profile.id) > 1){
            res.render('../../views/pages/add-siswa', { profile: profile, level: req.session.user['level'], page: "tambah-siswa", category: "admin" });
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
            console.log(result)
        })
    } else {
        noToken(res)
    }
})

router.post('/post/add-guru', function(req, res) {
    console.log(req.user.level);
    var id = req.user.id;
    var level;
    if (req.user.level == 1) {
        level = 1
    }
    if (req.user.level == 0) {
        level = 0
    }
    if (req.session.token) {
        db.query("UPDATE users SET level=? WHERE id=?", [level, id], function(err, result){
            if (err) throw err;
            res.end('{"success" : "Updated Successfully", "status" : 200}');
            console.log(result)
        })
    } else {
        noToken(res)
    }
})
router.get('/login', function(req,res) {
    res.render('../../views/pages/login')
})

module.exports = {
    router: router
}