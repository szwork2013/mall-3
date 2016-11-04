var db = require('./../db');

var Util = require('./../util/util');

var filter = require('./../filter');

var express = require('express');
var router = express.Router();

//分类
router.all('/goods/get_sort_list', function (req, res) {

    var type = Util.getVal(req).type || 1;
    var id = Util.getVal(req).id || 1;

    var sql = 'select * from sort where level=' + type;

    type != 1 && (sql += ' and parent_id='+id);

    db.sql(sql, function(data) {

        if(type == 2){
            var returnData = data,
                childSql = 'select * from sort where level=3 and';

            data.map(item => {
                childSql += (' parent_id='+item.id+' or');
            });
            childSql = childSql.slice(0, -3);

            db.sql(childSql, function(childData) {
                returnData.map(item => {
                    var saveData = [];
                    childData.map(childItem => {
                        childItem.parent_id == item.id && saveData.push(childItem);
                    });
                    item.data = saveData;
                })
                res.json({data: returnData});
            });

            return false;
        }

        res.json({data: data});
    });
})
//商品
router.all('/goods/get_goods_list', function (req, res) {

    var id = Util.getVal(req).id;
    var page = Util.getVal(req).page || 1;
    var num = Util.getVal(req).num || 10;

    var sql_count = 'select count(*) from goods_list where sort_id='+id;
    var sql_list = `select * from goods_list where sort_id=${id} limit ${(page - 1) * num},${num}`;

    var p1 = new Promise(function(resolve) {
        db.sql(sql_count, function(data) {
            resolve(data);
        })
    });

    var p2 = new Promise(function(resolve) {
        db.sql(sql_list, function(data) {
            resolve(data);
        })
    });

    Promise.all([p1, p2]).then(function(result) {
        res.json({
            data: result[1],
            count: result[0][0]['count(*)']
        });
    });
})
//获得商品详情
router.all('/goods/get_goods_detail', function (req, res) {

    var id = Util.getVal(req).id;
    var sql = 'select * from goods_list where id='+id;

    db.sql(sql, function(data) {
        data = data[0];
        data.images = data.images.split(',');
        data.is_have = data.surplus > 0;
        res.json({data: data});
    });
})
//获得商品评论
router.all('/goods/get_goods_comment', function (req, res) {

    var id = Util.getVal(req).id;

    var sql_count = 'select count(*) from goods_comment where goods_id='+id;
    var sql = 'select * from goods_comment where goods_id='+id;

    db.sql(sql_count, function(data) {

        var count = data[0]['count(*)'];

        db.sql(sql, function(data) {
            var allScore = 0,
                percent = 0;

            data.map(item => {
                allScore = Util.floatAdd(allScore,item.score);
            })

            percent = parseInt(allScore / (5 * count) * 10000) / 100;

            res.json({
                data: data,
                count: count,
                percent: percent
            });
        });
    });
})

module.exports = router;
