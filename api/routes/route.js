var express = require('express');
var router = express.Router();

var fs = require('fs');

//首页
router.all('/', function (req, res, next) {

    console.log(123345678);
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //res.end(fs.readFileSync('index.html'));

    next();
});

module.exports = router;
