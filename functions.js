var db = require('./db/mysql_query');


function checkLevel(profile) {
    return new Promise(function(resolve, reject) {
        db.query('SELECT * from users where id=?', [ profile["id"] ], function(error, results) {
            if (error) {
                return reject(error);
            }
            else {
                resolve(results);
            }
        } )
    })
}

module.exports = {
    checkLevel: checkLevel
};