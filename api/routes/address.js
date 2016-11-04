var db = require('./../db');

var Util = require('./../util/util');
var filter = require('./../filter');

var express = require('express');
var router = express.Router();

//地址列表
router.all('/address/get_address_list', filter.authorize, function (req, res) {

        var user_id = req.session.user_id;

        var sql = 'select * from address where user_id=' + user_id;

        db.sql(sql, function(data) {
            res.json({data: data});
        });
    })
//获得默认地址
router.all('/address/get_default_address', filter.authorize, function (req, res) {

        var user_id = req.session.user_id;

        var sql = 'select * from address where is_default=1 and user_id=' + user_id;

        db.sql(sql, function(data) {
            res.json({
                data: data[0] || {}
            });
        });
    })
//添加地址
router.all('/address/add_address', filter.authorize, function (req, res) {

        var query = Util.getVal(req);
        query.province_code = query.province;
        query.city_code = query.city;
        query.area_code = query.area;

        var user_id = req.session.user_id;

        var nameArr = [
            'address',
            'receive_name',
            'receive_phone',
            'code',
            'province_code',
            'city_code',
            'area_code',
            'province_name',
            'city_name',
            'area_name'
        ];

        var sql_name = '(user_id,',
            sql_value = `(${user_id},`;

        nameArr.map(item => {
            if(!query[item]) {
                return true;
            }
            sql_name += (item + ',');
            sql_value += ('"'+query[item] +'",');
        });

        sql_name = sql_name.slice(0, -1);
        sql_value = sql_value.slice(0, -1);

        sql_name += ')';
        sql_value += ')';

        var sql = `insert into address ${sql_name} value ${sql_value}`;

        db.sql(sql, function(data) {
            res.json({request_id: '123456'});
        });
    })

module.exports = router;
