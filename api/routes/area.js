var db = require('./../db');

var Util = require('./../util/util');

var express = require('express');
var router = express.Router();

router.all('/area/get_area_list', function (req, res) {

    var type = Util.getVal(req).type || 1;
    var code = Util.getVal(req).code || 0;

    var sql = 'select * from area where type=' + type;

    if(type != 1) {
        sql += ' and parent_code =' + code;
    }

    db.sql(sql, function(data) {
        res.json({data: data});
    });
})

module.exports = router;
