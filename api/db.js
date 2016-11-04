var mysql = require('mysql');
var db = {};
//连接数据库
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database:'jd'
});

db.sql = function (sql, callBack) {
    pool.getConnection(function(err, connection){
        connection.query(sql, function(err, rows, fields) {
            if (err) throw err;
            callBack(rows, err);
            connection.release();
        });
    });
};

module.exports = db;
