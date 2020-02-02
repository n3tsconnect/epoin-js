var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'epoin',
    password : 'itsSoIntense!1',
    database : 'epoinv2'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;