var fs = require('fs');

var express = require('express');
var router = express.Router();

//跨域
router.all('*', function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("X-Powered-By",' 3.2.1');
    //res.header("Content-Type", "application/json;charset=utf-8");

    req.session.touch();
    //req.session.user_id = 10;

    next();
});

module.exports = router;
